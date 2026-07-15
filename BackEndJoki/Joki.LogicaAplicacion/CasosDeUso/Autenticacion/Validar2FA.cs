using Joki.CasoUsoCompartida.Configuracion;
using Joki.CasoUsoCompartida.DTOs.Autenticacion;
using Joki.CasoUsoCompartida.DTOs.Usuario;
using Joki.CasoUsoCompartida.InterfacesCasosUso.Autenticacion;
using Joki.LogicaNegocio.Entidades;
using Joki.LogicaNegocio.Enums;
using Joki.LogicaNegocio.InterfacesRepositorio;
using Microsoft.Extensions.Options;
using OtpNet;
using alumnoEntidad = Joki.LogicaNegocio.Entidades.Alumno;
using entrenadorEntidad = Joki.LogicaNegocio.Entidades.Entrenador;

namespace Joki.LogicaAplicacion.CasosDeUso.Autenticacion
{
    public class Validar2FA : IValidar2FA
    {
        private readonly IRepositorioUsuario
            _repositorioUsuario;

        private readonly DemoSettings
            _demoSettings;

        public Validar2FA(
            IRepositorioUsuario repositorioUsuario,
            IOptions<DemoSettings> demoSettings)
        {
            _repositorioUsuario =
                repositorioUsuario;

            _demoSettings =
                demoSettings.Value;
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

            string email =
                request.Email.Trim();

            string codigo =
                request.Codigo.Trim();

            Usuario? usuario =
                _repositorioUsuario.ObtenerPorEmail(
                    email);

            if (usuario == null ||
                usuario.Estado != EstadoUsuario.ACTIVO ||
                !usuario.TwoFactorEnabled)
            {
                return null;
            }

            bool codigoAuthenticatorValido =
                ValidarCodigoAuthenticator(
                    usuario,
                    codigo);

            bool codigoDemoValido =
                EsCodigoDemoValido(
                    email,
                    codigo);

            if (!codigoAuthenticatorValido &&
                !codigoDemoValido)
            {
                return null;
            }

            usuario.UltimoAcceso =
                DateTime.UtcNow;

            _repositorioUsuario.Modificar(
                usuario);

            string rol;

            if (usuario.Rol != null &&
                !string.IsNullOrWhiteSpace(
                    usuario.Rol.Nombre))
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

        private static bool ValidarCodigoAuthenticator(
            Usuario usuario,
            string codigo)
        {
            if (string.IsNullOrWhiteSpace(
                    usuario.TwoFactorSecret))
            {
                return false;
            }

            try
            {
                byte[] secretBytes =
                    Base32Encoding.ToBytes(
                        usuario.TwoFactorSecret);

                var totp =
                    new Totp(secretBytes);

                return totp.VerifyTotp(
                    codigo,
                    out _,
                    new VerificationWindow(
                        previous: 1,
                        future: 1));
            }
            catch
            {
                return false;
            }
        }

        private bool EsCodigoDemoValido(
            string email,
            string codigo)
        {
            if (!_demoSettings.Habilitado)
            {
                return false;
            }

            bool emailPermitido =
                _demoSettings.EmailsPermitidos.Any(
                    emailConfigurado =>
                        emailConfigurado.Equals(
                            email,
                            StringComparison.OrdinalIgnoreCase));

            if (!emailPermitido)
            {
                return false;
            }

            return codigo ==
                   _demoSettings.CodigoAlternativo2FA;
        }
    }
}