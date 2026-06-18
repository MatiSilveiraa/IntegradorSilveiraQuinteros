using Joki.CasoUsoCompartida.DTOs.Autenticacion;
using Joki.CasoUsoCompartida.InterfacesCasosUso.Autenticacion;
using Joki.LogicaNegocio.Entidades;
using Joki.LogicaNegocio.Excepciones;
using Joki.LogicaNegocio.InterfacesRepositorio;

namespace Joki.LogicaAplicacion.CasosDeUso.Autenticacion
{
    public class SolicitarLoginSinPassword :
        ISolicitarLoginSinPassword
    {
        private readonly IRepositorioUsuario _repositorioUsuario;
        private readonly IRepositorioCodigoLoginSinPassword _repositorioCodigo;
        private readonly IServicioEmail _servicioEmail;

        public SolicitarLoginSinPassword(
            IRepositorioUsuario repositorioUsuario,
            IRepositorioCodigoLoginSinPassword repositorioCodigo,
            IServicioEmail servicioEmail)
        {
            _repositorioUsuario = repositorioUsuario;
            _repositorioCodigo = repositorioCodigo;
            _servicioEmail = servicioEmail;
        }

        public void Ejecutar(
            LoginSinPasswordRequest request)
        {
            if (request == null ||
                string.IsNullOrWhiteSpace(request.Email))
            {
                throw new LogicaNegocioException(
                    "Debe ingresar un email válido");
            }

            var usuario =
                _repositorioUsuario.ObtenerPorEmail(
                    request.Email);

            if (usuario == null)
            {
                throw new LogicaNegocioException(
                    "No existe un usuario con ese email");
            }

            var codigoAnterior =
                _repositorioCodigo
                    .ObtenerUltimoPendientePorUsuario(
                        usuario.UsuarioId);

            if (codigoAnterior != null)
            {
                if (codigoAnterior.FechaCreacion >
                    DateTime.UtcNow.AddMinutes(-1))
                {
                    throw new LogicaNegocioException(
                        "Debes esperar un minuto antes de solicitar otro código");
                }

                codigoAnterior.Usado = true;

                _repositorioCodigo.Modificar(
                    codigoAnterior);
            }

            string codigo =
                Random.Shared.Next(100000, 999999)
                    .ToString();

            var loginCodigo =
                new CodigoLoginSinPassword
                {
                    UsuarioId = usuario.UsuarioId,
                    Codigo = codigo,
                    FechaCreacion = DateTime.UtcNow,
                    FechaExpiracion =
                        DateTime.UtcNow.AddMinutes(10),
                    Usado = false
                };

            _repositorioCodigo.Agregar(
                loginCodigo);

            _servicioEmail.EnviarCodigoRecuperacion(
                usuario.Email.Valor,
                codigo);
        }
    }
}