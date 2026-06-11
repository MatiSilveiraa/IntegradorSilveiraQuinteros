using Joki.CasoUsoCompartida.InterfacesCasosUso.Desafio;
using Joki.LogicaNegocio.Entidades;
using Joki.LogicaNegocio.Enums;
using Joki.LogicaNegocio.Excepciones;
using Joki.LogicaNegocio.InterfacesRepositorio;
using Entidades = Joki.LogicaNegocio.Entidades;

namespace Joki.LogicaAplicacion.CasosDeUso.Desafio
{
    public class ParticiparDesafio :
        IParticiparDesafio
    {
        private readonly IRepositorioDesafio _repositorioDesafio;
        private readonly IRepositorioAlumno _repositorioAlumno;
        private readonly IRepositorioParticipacionDesafio _repositorioParticipacionDesafio;
        private readonly IRepositorioNotificacion _repositorioNotificacion;

        public ParticiparDesafio(
            IRepositorioDesafio repositorioDesafio,
            IRepositorioAlumno repositorioAlumno,
            IRepositorioParticipacionDesafio repositorioParticipacionDesafio,
            IRepositorioNotificacion repositorioNotificacion)
        {
            _repositorioDesafio = repositorioDesafio;
            _repositorioAlumno = repositorioAlumno;
            _repositorioParticipacionDesafio = repositorioParticipacionDesafio;
            _repositorioNotificacion = repositorioNotificacion;
        }

        public void Ejecutar(
            int desafioId,
            int alumnoId)
        {
            var desafio =
                _repositorioDesafio.ObtenerPorId(desafioId);

            if (desafio == null || !desafio.Activo)
            {
                throw new LogicaNegocioException(
                    "No existe el desafío");
            }

            if (DateTime.Now < desafio.FechaInicio ||
                DateTime.Now > desafio.FechaFin)
            {
                throw new LogicaNegocioException(
                    "El desafío no está disponible para participar");
            }

            var alumno =
                _repositorioAlumno.ObtenerPorId(alumnoId);

            if (alumno == null)
            {
                throw new LogicaNegocioException(
                    "No existe el alumno");
            }

            var participacionExistente =
                _repositorioParticipacionDesafio.Obtener(
                    alumnoId,
                    desafioId);

            if (participacionExistente != null)
            {
                throw new LogicaNegocioException(
                    "El alumno ya participa en este desafío");
            }

            var participacion =
                new ParticipacionDesafio
                {
                    AlumnoId = alumnoId,
                    DesafioId = desafioId,
                    Resultado = "Participando",
                    Ganador = false
                };

            _repositorioParticipacionDesafio.Agregar(
                participacion);

            _repositorioNotificacion.Agregar(
    new Entidades.Notificacion
    {
        UsuarioId = alumnoId,
        Titulo = "Participación registrada",
        Mensaje = $"Te inscribiste correctamente al desafío {desafio.Titulo}.",
        Tipo = TipoNotificacion.Desafio,
        UrlDestino = $"/desafios/{desafio.Id}",
        EntidadReferencia = "Desafio",
        EntidadReferenciaId = desafio.Id
    });
        }
    }
}