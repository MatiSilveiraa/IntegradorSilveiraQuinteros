using Joki.CasoUsoCompartida.InterfacesCasosUso.Grupo;
using Joki.LogicaNegocio.Entidades;
using Joki.LogicaNegocio.Excepciones;
using Joki.LogicaNegocio.InterfacesRepositorio;

namespace Joki.LogicaAplicacion.CasosDeUso.Grupo
{
    public class DesinscribirAlumno : IDesinscribirAlumno
    {
        private readonly IRepositorioInscripcion _repositorioInscripcion;

        private readonly IRepositorioListaEspera _repositorioListaEspera;

        private readonly IRepositorioAlumno _repositorioAlumno;

        private readonly IRepositorioClase _repositorioClase;

        private readonly IServicioEmail _servicioEmail;

        public DesinscribirAlumno(
            IRepositorioInscripcion repositorioInscripcion,
            IRepositorioListaEspera repositorioListaEspera,
            IRepositorioAlumno repositorioAlumno,
            IRepositorioClase repositorioClase,
            IServicioEmail servicioEmail)
        {
            _repositorioInscripcion = repositorioInscripcion;

            _repositorioListaEspera = repositorioListaEspera;

            _repositorioAlumno = repositorioAlumno;

            _repositorioClase = repositorioClase;

            _servicioEmail = servicioEmail;
        }

        public void Ejecutar(int alumnoId, int claseId)
        {
            if (!_repositorioInscripcion.Existe(alumnoId, claseId))
            {
                throw new LogicaNegocioException(
                    "El alumno no está inscripto en esta clase");
            }

            _repositorioInscripcion.Remover(
                alumnoId,
                claseId);

            var alumnosEnEspera = _repositorioListaEspera
                .ObtenerAlumnosEnEspera(claseId)
                .ToList();

            if (!alumnosEnEspera.Any())
            {
                return;
            }

            var proximoAlumnoId = alumnosEnEspera.First();

            var clase = _repositorioClase.ObtenerPorId(claseId);

            if (clase == null)
            {
                throw new LogicaNegocioException(
                    "Clase no encontrada");
            }

            if (!clase.TieneCupoDisponible())
            {
                return;
            }

            var nuevaInscripcion = new Inscripcion
            {
                AlumnoId = proximoAlumnoId,
                ClaseId = claseId,
                FechaInscripcion = DateTime.UtcNow
            };

            _repositorioInscripcion.Agregar(
                nuevaInscripcion);

            _repositorioListaEspera.Remover(
                proximoAlumnoId,
                claseId);

            var alumnoPromovido =
                _repositorioAlumno.ObtenerPorId(
                    proximoAlumnoId);

            if (alumnoPromovido != null)
            {
                _servicioEmail.EnviarNotificacionInscripcion(
                    alumnoPromovido.Email.Valor,
                    clase.Grupo.Nombre);
            }
        }
    }
}