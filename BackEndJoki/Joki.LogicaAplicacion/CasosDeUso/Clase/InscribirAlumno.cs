using Joki.CasoUsoCompartida.InterfacesCasosUso.Grupo;
using Joki.LogicaNegocio.Entidades;
using Joki.LogicaNegocio.Enums;
using Joki.LogicaNegocio.Excepciones;
using Joki.LogicaNegocio.InterfacesRepositorio;

namespace Joki.LogicaAplicacion.CasosDeUso.Grupo
{
    public class InscribirAlumno : IInscribirAlumno
    {
        private readonly IRepositorioClase _repositorioClase;
        private readonly IRepositorioAlumno _repositorioAlumno;
        private readonly IRepositorioInscripcion _repositorioInscripcion;
        private readonly IRepositorioListaEspera _repositorioListaEspera;

        public InscribirAlumno(
            IRepositorioClase repositorioClase,
            IRepositorioAlumno repositorioAlumno,
            IRepositorioInscripcion repositorioInscripcion,
            IRepositorioListaEspera repositorioListaEspera)
        {
            _repositorioClase = repositorioClase;
            _repositorioAlumno = repositorioAlumno;
            _repositorioInscripcion = repositorioInscripcion;
            _repositorioListaEspera = repositorioListaEspera;
        }

        public string Ejecutar(int alumnoId, int claseId)
        {
            var alumno = _repositorioAlumno.ObtenerPorId(alumnoId);

            if (alumno == null)
            {
                throw new LogicaNegocioException(
                    "Alumno no existe");
            }

            if (alumno.Estado != EstadoUsuario.ACTIVO)
            {
                throw new LogicaNegocioException(
                    "Alumno inactivo");
            }

            if (alumno.BloqueadoPorInasistencias)
            {
                throw new LogicaNegocioException(
                    "El alumno se encuentra bloqueado por inasistencias y no puede inscribirse a nuevas clases");
            }

            var clase = _repositorioClase.ObtenerPorId(claseId);

            if (clase == null)
            {
                throw new LogicaNegocioException(
                    "Clase no existe");
            }

            if (clase.Estado != EstadoClase.Programada)
            {
                throw new LogicaNegocioException(
                    "Clase no disponible");
            }

            if (_repositorioInscripcion.Existe(alumnoId, claseId))
            {
                throw new LogicaNegocioException(
                    "El alumno ya está inscripto");
            }

            if (_repositorioClase.TieneConflictoHorario(
                alumnoId,
                clase))
            {
                throw new LogicaNegocioException(
                    "Superposición horaria");
            }

            if (_repositorioListaEspera.Existe(
                alumnoId,
                claseId))
            {
                throw new LogicaNegocioException(
                    "Ya está en lista de espera");
            }

            if (!clase.TieneCupoDisponible())
            {
                _repositorioListaEspera.Agregar(
                    alumnoId,
                    claseId);

                return "LISTA_ESPERA";
            }

            var inscripcion = new Inscripcion
            {
                AlumnoId = alumnoId,
                ClaseId = claseId,
                FechaInscripcion = DateTime.UtcNow
            };

            _repositorioInscripcion.Agregar(inscripcion);

            return "INSCRIPTO";
        }
    }
}