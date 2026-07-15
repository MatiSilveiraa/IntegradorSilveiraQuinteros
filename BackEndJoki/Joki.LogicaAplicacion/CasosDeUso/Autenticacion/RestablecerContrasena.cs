using Joki.CasoUsoCompartida.Configuracion;
using Joki.CasoUsoCompartida.DTOs.Autenticacion;
using Joki.CasoUsoCompartida.InterfacesCasosUso.Autenticacion;
using Joki.LogicaNegocio.Excepciones;
using Joki.LogicaNegocio.InterfacesRepositorio;
using Joki.LogicaNegocio.ValueObjects;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;

namespace Joki.LogicaAplicacion.CasosDeUso.Autenticacion
{
    public class RestablecerContrasena :
        IRestablecerContrasena
    {
        private readonly IRepositorioUsuario
            _repositorioUsuario;

        private readonly IRepositorioRecuperacionContrasena
            _repositorioRecuperacion;

        private readonly DemoSettings
            _demoSettings;

        public RestablecerContrasena(
            IRepositorioUsuario repositorioUsuario,
            IRepositorioRecuperacionContrasena repositorioRecuperacion,
            IOptions<DemoSettings> demoSettings)
        {
            _repositorioUsuario =
                repositorioUsuario;

            _repositorioRecuperacion =
                repositorioRecuperacion;

            _demoSettings =
                demoSettings.Value;
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

            string email =
                request.Email.Trim();

            string codigo =
                request.Codigo.Trim();

            var usuario =
                _repositorioUsuario.ObtenerPorEmail(
                    email);

            if (usuario == null)
            {
                throw new LogicaNegocioException(
                    "Código inválido o expirado");
            }

            var recuperacion =
                _repositorioRecuperacion
                    .ObtenerActivaPorUsuarioYCodigo(
                        usuario.UsuarioId,
                        codigo);

            bool codigoDemoValido =
                EsCodigoDemoValido(
                    email,
                    codigo);

            if (recuperacion == null &&
                !codigoDemoValido)
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

            if (recuperacion != null)
            {
                recuperacion.Usado = true;

                _repositorioRecuperacion.Modificar(
                    recuperacion);
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
                   _demoSettings.CodigoRecuperacion;
        }
    }
}