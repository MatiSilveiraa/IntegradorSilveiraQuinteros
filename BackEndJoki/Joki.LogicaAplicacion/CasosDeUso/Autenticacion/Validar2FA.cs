using Joki.CasoUsoCompartida.DTOs.Autenticacion;
using Joki.CasoUsoCompartida.DTOs.Usuario;
using Joki.CasoUsoCompartida.InterfacesCasosUso.Autenticacion;
using Joki.LogicaNegocio.Entidades;
using Joki.LogicaNegocio.Enums;
using Joki.LogicaNegocio.InterfacesRepositorio;
using OtpNet;
using alumnoEntidad = Joki.LogicaNegocio.Entidades.Alumno;
using entrenadorEntidad = Joki.LogicaNegocio.Entidades.Entrenador;

namespace Joki.LogicaAplicacion.CasosDeUso.Autenticacion
{
    public class Validar2FA : IValidar2FA
    {
        private readonly IRepositorioUsuario _repositorioUsuario;

        public Validar2FA(IRepositorioUsuario repositorioUsuario)
        {
            _repositorioUsuario = repositorioUsuario;
        }

        public DtoDatosUsuario? Ejecutar(
            Validar2FARequest request)
        {
            if (request == null ||
                string.IsNullOrWhiteSpace(request.Email) ||
                string.IsNullOrWhiteSpace(request.Codigo))
            {
                return null;
            }

            Usuario? usuario =
                _repositorioUsuario.ObtenerPorEmail(
                    request.Email);

            if (usuario == null ||
                usuario.Estado != EstadoUsuario.ACTIVO ||
                !usuario.TwoFactorEnabled ||
                string.IsNullOrWhiteSpace(usuario.TwoFactorSecret))
            {
                return null;
            }

            var secretBytes =
                Base32Encoding.ToBytes(
                    usuario.TwoFactorSecret);

            var totp =
                new Totp(secretBytes);

            bool valido =
                totp.VerifyTotp(
                    request.Codigo,
                    out _,
                    new VerificationWindow(
                        previous: 1,
                        future: 1));

            if (!valido)
            {
                return null;
            }

            usuario.UltimoAcceso = DateTime.UtcNow;

            _repositorioUsuario.Modificar(usuario);

            string rol;

            if (usuario.Rol != null &&
                !string.IsNullOrWhiteSpace(usuario.Rol.Nombre))
            {
                rol = usuario.Rol.Nombre;
            }
            else
            {
                rol = usuario switch
                {
                    entrenadorEntidad => "Entrenador",
                    alumnoEntidad => "Alumno",
                    _ => "Alumno"
                };
            }

            return new DtoDatosUsuario(
                usuario.UsuarioId,
                usuario.Nombre.Valor,
                usuario.Apellido.Valor,
                usuario.Email.Valor,
                rol
            );
        }
    }
}