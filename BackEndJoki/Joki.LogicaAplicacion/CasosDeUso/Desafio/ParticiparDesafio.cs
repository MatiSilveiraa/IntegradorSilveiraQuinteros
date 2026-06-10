using Joki.CasoUsoCompartida.InterfacesCasosUso.Desafio;
using Joki.LogicaNegocio.Entidades;
using Joki.LogicaNegocio.Excepciones;
using Joki.LogicaNegocio.InterfacesRepositorio;

namespace Joki.LogicaAplicacion.CasosDeUso.Desafio
{
    public class ParticiparDesafio :
        IParticiparDesafio
    {
        private readonly IRepositorioDesafio _repositorioDesafio;
        private readonly IRepositorioAlumno _repositorioAlumno;
        private readonly IRepositorioParticipacionDesafio _repositorioParticipacionDesafio;

        public ParticiparDesafio(
            IRepositorioDesafio repositorioDesafio,
            IRepositorioAlumno repositorioAlumno,
            IRepositorioParticipacionDesafio repositorioParticipacionDesafio)
        {
            _repositorioDesafio = repositorioDesafio;
            _repositorioAlumno = repositorioAlumno;
            _repositorioParticipacionDesafio = repositorioParticipacionDesafio;
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
        }
    }
}