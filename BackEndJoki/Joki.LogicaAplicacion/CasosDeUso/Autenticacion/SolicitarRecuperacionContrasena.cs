using Joki.CasoUsoCompartida.DTOs.Autenticacion;
using Joki.CasoUsoCompartida.InterfacesCasosUso.Autenticacion;
using Joki.LogicaNegocio.Entidades;
using Joki.LogicaNegocio.Excepciones;
using Joki.LogicaNegocio.InterfacesRepositorio;
using System.Net.Mail;
using System.Security.Cryptography;

namespace Joki.LogicaAplicacion.CasosDeUso.Autenticacion
{
    public class SolicitarRecuperacionContrasena :
        ISolicitarRecuperacionContrasena
    {
        private readonly IRepositorioUsuario
            _repositorioUsuario;

        private readonly IRepositorioRecuperacionContrasena
            _repositorioRecuperacion;

        private readonly IServicioEmail
            _servicioEmail;

        public SolicitarRecuperacionContrasena(
            IRepositorioUsuario repositorioUsuario,
            IRepositorioRecuperacionContrasena repositorioRecuperacion,
            IServicioEmail servicioEmail)
        {
            _repositorioUsuario =
                repositorioUsuario;

            _repositorioRecuperacion =
                repositorioRecuperacion;

            _servicioEmail =
                servicioEmail;
        }

        public void Ejecutar(
            SolicitarRecuperacionRequest request)
        {
            if (request == null ||
                !EsEmailValido(request.Email))
            {
                throw new LogicaNegocioException(
                    "Debe ingresar un email válido");
            }

            string email =
                request.Email.Trim();

            var usuario =
                _repositorioUsuario.ObtenerPorEmail(
                    email);
            if (usuario == null)
            {
                return;
            }

            var recuperacionExistente =
                _repositorioRecuperacion
                    .ObtenerUltimaPorUsuario(
                        usuario.UsuarioId);

            if (recuperacionExistente != null &&
                !recuperacionExistente.Usado &&
                recuperacionExistente.FechaCreacion >
                    DateTime.UtcNow.AddMinutes(-1))
            {
                return;
            }

            string codigo =
                GenerarCodigoSeguro();

            if (recuperacionExistente != null &&
                !recuperacionExistente.Usado)
            {
                recuperacionExistente.Codigo =
                    codigo;

                recuperacionExistente.FechaCreacion =
                    DateTime.UtcNow;

                recuperacionExistente.FechaExpiracion =
                    DateTime.UtcNow.AddMinutes(20);

                recuperacionExistente.Usado =
                    false;

                _repositorioRecuperacion.Modificar(
                    recuperacionExistente);
            }
            else
            {
                var recuperacion =
                    new RecuperacionContrasena
                    {
                        UsuarioId =
                            usuario.UsuarioId,

                        Codigo =
                            codigo,

                        FechaCreacion =
                            DateTime.UtcNow,

                        FechaExpiracion =
                            DateTime.UtcNow.AddMinutes(20),

                        Usado =
                            false
                    };

                _repositorioRecuperacion.Agregar(
                    recuperacion);
            }

            try
            {
                _servicioEmail
                    .EnviarCodigoRecuperacion(
                        usuario.Email.Valor,
                        codigo);
            }
            catch
            {
            }
        }

        private static string GenerarCodigoSeguro()
        {
            int codigo =
                RandomNumberGenerator.GetInt32(
                    100000,
                    1000000);

            return codigo.ToString();
        }

        private static bool EsEmailValido(
            string? email)
        {
            if (string.IsNullOrWhiteSpace(email))
            {
                return false;
            }

            try
            {
                var direccion =
                    new MailAddress(email.Trim());

                return direccion.Address.Equals(
                    email.Trim(),
                    StringComparison.OrdinalIgnoreCase);
            }
            catch
            {
                return false;
            }
        }
    }
}