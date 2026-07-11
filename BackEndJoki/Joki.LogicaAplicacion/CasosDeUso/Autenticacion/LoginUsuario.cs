using Joki.CasoUsoCompartida.DTOs.Autenticacion;
using Joki.CasoUsoCompartida.DTOs.Usuario;
using Joki.CasoUsoCompartida.InterfacesCasosUso.Autenticacion;
using Joki.LogicaNegocio.Enums;
using Joki.LogicaNegocio.InterfacesRepositorio;
using Microsoft.AspNetCore.Identity;
using alumnoEntidad = Joki.LogicaNegocio.Entidades.Alumno;
using entrenadorEntidad = Joki.LogicaNegocio.Entidades.Entrenador;

namespace Joki.LogicaAplicacion.CasosDeUso.Autenticacion
{
    public class LoginUsuario : ILoginUsuario
    {
        private readonly IRepositorioUsuario _repositorioUsuario;
        private readonly PasswordHasher<object> _hasheador;
        private readonly string _hashFicticio;

        public LoginUsuario(
            IRepositorioUsuario repositorioUsuario)
        {
            _repositorioUsuario = repositorioUsuario;
            _hasheador = new PasswordHasher<object>();
            _hashFicticio = _hasheador.HashPassword(
                null!,
                "Joki-Dummy-Password-For-Timing-Only");
        }

        public DtoDatosUsuario? Ejecutar(
            LoginRequest request)
        {
            if (request == null ||
                string.IsNullOrWhiteSpace(request.Email) ||
                string.IsNullOrWhiteSpace(request.Password))
            {
                return null;
            }

            Usuario? usuario =
                _repositorioUsuario.ObtenerPorEmail(
                    request.Email.Trim());

            string hashAValidar =
                usuario != null &&
                usuario.Contrasena != null &&
                !string.IsNullOrWhiteSpace(
                    usuario.Contrasena.Valor)
                    ? usuario.Contrasena.Valor
                    : _hashFicticio;

            PasswordVerificationResult resultado;

            try
            {
                resultado =
                    _hasheador.VerifyHashedPassword(
                        null!,
                        hashAValidar,
                        request.Password);
            }
            catch
            {
                resultado =
                    PasswordVerificationResult.Failed;
            }

            if (usuario == null ||
                usuario.Estado != EstadoUsuario.ACTIVO ||
                resultado == PasswordVerificationResult.Failed)
            {
                return null;
            }

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

            usuario.UltimoAcceso =
                DateTime.UtcNow;

            _repositorioUsuario.Modificar(
                usuario);

            return new DtoDatosUsuario(
                usuario.UsuarioId,
                usuario.Nombre.Valor,
                usuario.Apellido.Valor,
                usuario.Email.Valor,
                rol);
        }
    }
}