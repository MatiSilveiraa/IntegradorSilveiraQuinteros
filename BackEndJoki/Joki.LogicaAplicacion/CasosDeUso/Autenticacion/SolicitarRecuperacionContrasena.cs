using Joki.CasoUsoCompartida.DTOs.Autenticacion;
using Joki.CasoUsoCompartida.InterfacesCasosUso.Autenticacion;
using Joki.LogicaNegocio.Entidades;
using Joki.LogicaNegocio.Excepciones;
using Joki.LogicaNegocio.InterfacesRepositorio;

namespace Joki.LogicaAplicacion.CasosDeUso.Autenticacion
{
    public class SolicitarRecuperacionContrasena :
        ISolicitarRecuperacionContrasena
    {
        private readonly IRepositorioUsuario _repositorioUsuario;
        private readonly IRepositorioRecuperacionContrasena _repositorioRecuperacion;
        private readonly IServicioEmail _servicioEmail;

        public SolicitarRecuperacionContrasena(
            IRepositorioUsuario repositorioUsuario,
            IRepositorioRecuperacionContrasena repositorioRecuperacion,
            IServicioEmail servicioEmail)
        {
            _repositorioUsuario = repositorioUsuario;
            _repositorioRecuperacion = repositorioRecuperacion;
            _servicioEmail = servicioEmail;
        }

        public void Ejecutar(
            SolicitarRecuperacionRequest request)
        {
            var usuario =
                _repositorioUsuario.ObtenerPorEmail(
                    request.Email);

            if (usuario == null)
            {
                throw new LogicaNegocioException(
                    "No existe un usuario con ese email");
            }

            string codigo =
                Random.Shared.Next(100000, 999999)
                    .ToString();

            var recuperacion =
                new RecuperacionContrasena
                {
                    UsuarioId = usuario.UsuarioId,
                    Codigo = codigo,
                    FechaCreacion = DateTime.UtcNow,
                    FechaExpiracion =
                        DateTime.UtcNow.AddMinutes(15),
                    Usado = false
                };

            _repositorioRecuperacion
                .Agregar(recuperacion);

            _servicioEmail.EnviarCodigoRecuperacion(
                usuario.Email.ToString(),
                codigo);
        }
    }
}
