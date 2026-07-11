using Joki.CasoUsoCompartida.DTOs.Autenticacion;
using Joki.CasoUsoCompartida.InterfacesCasosUso.Autenticacion;
using Joki.LogicaNegocio.Entidades;
using Joki.LogicaNegocio.Excepciones;
using Joki.LogicaNegocio.InterfacesRepositorio;
using System.Net.Mail;
using System.Security.Cryptography;

namespace Joki.LogicaAplicacion.CasosDeUso.Autenticacion
{
    public class SolicitarLoginSinPassword :
        ISolicitarLoginSinPassword
    {
        private readonly IRepositorioUsuario
            _repositorioUsuario;

        private readonly IRepositorioCodigoLoginSinPassword
            _repositorioCodigo;

        private readonly IServicioEmail
            _servicioEmail;

        public SolicitarLoginSinPassword(
            IRepositorioUsuario repositorioUsuario,
            IRepositorioCodigoLoginSinPassword repositorioCodigo,
            IServicioEmail servicioEmail)
        {
            _repositorioUsuario =
                repositorioUsuario;

            _repositorioCodigo =
                repositorioCodigo;

            _servicioEmail =
                servicioEmail;
        }

        public void Ejecutar(
            LoginSinPasswordRequest request)
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

            var codigoAnterior =
                _repositorioCodigo
                    .ObtenerUltimoPendientePorUsuario(
                        usuario.UsuarioId);
            if (codigoAnterior != null &&
                codigoAnterior.FechaCreacion >
                    DateTime.UtcNow.AddMinutes(-1))
            {
                return;
            }

            if (codigoAnterior != null)
            {
                codigoAnterior.Usado =
                    true;

                _repositorioCodigo.Modificar(
                    codigoAnterior);
            }

            string codigo =
                GenerarCodigoSeguro();

            var loginCodigo =
                new CodigoLoginSinPassword
                {
                    UsuarioId =
                        usuario.UsuarioId,

                    Codigo =
                        codigo,

                    FechaCreacion =
                        DateTime.UtcNow,

                    FechaExpiracion =
                        DateTime.UtcNow.AddMinutes(10),

                    Usado =
                        false
                };

            _repositorioCodigo.Agregar(
                loginCodigo);

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