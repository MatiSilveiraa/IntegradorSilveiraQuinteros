using Joki.CasoUsoCompartida.DTOs.Autenticacion;
using Joki.CasoUsoCompartida.InterfacesCasosUso.Autenticacion;
using Joki.LogicaNegocio.Excepciones;
using Joki.LogicaNegocio.InterfacesRepositorio;
using Joki.LogicaNegocio.ValueObjects;
using Microsoft.AspNetCore.Identity;

namespace Joki.LogicaAplicacion.CasosDeUso.Autenticacion
{
    public class RestablecerContrasena :
        IRestablecerContrasena
    {
        private readonly IRepositorioUsuario
            _repositorioUsuario;

        private readonly IRepositorioRecuperacionContrasena
            _repositorioRecuperacion;

        public RestablecerContrasena(
            IRepositorioUsuario repositorioUsuario,
            IRepositorioRecuperacionContrasena repositorioRecuperacion)
        {
            _repositorioUsuario =
                repositorioUsuario;

            _repositorioRecuperacion =
                repositorioRecuperacion;
        }

        public void Ejecutar(
            RestablecerContrasenaRequest request)
        {
            if (request == null ||
                string.IsNullOrWhiteSpace(request.Email) ||
                string.IsNullOrWhiteSpace(request.Codigo) ||
                string.IsNullOrWhiteSpace(
                    request.NuevaContrasena))
            {
                throw new LogicaNegocioException(
                    "Debe completar todos los campos");
            }

            var usuario =
                _repositorioUsuario.ObtenerPorEmail(
                    request.Email.Trim());

            if (usuario == null)
            {
                throw new LogicaNegocioException(
                    "Código inválido o expirado");
            }

            var recuperacion =
                _repositorioRecuperacion
                    .ObtenerActivaPorUsuarioYCodigo(
                        usuario.UsuarioId,
                        request.Codigo.Trim());

            if (recuperacion == null)
            {
                throw new LogicaNegocioException(
                    "Código inválido o expirado");
            }

            var passwordHasher =
                new PasswordHasher<object>();

            string hash =
                passwordHasher.HashPassword(
                    null!,
                    request.NuevaContrasena);

            usuario.Contrasena =
                Contrasena.FromHash(hash);

            usuario.ProveedorAutenticacion =
                usuario.ProveedorAutenticacion == "GOOGLE"
                    ? "GOOGLE_LOCAL"
                    : "LOCAL";

            _repositorioUsuario.Modificar(
                usuario);

            recuperacion.Usado =
                true;

            _repositorioRecuperacion.Modificar(
                recuperacion);
        }
    }
}