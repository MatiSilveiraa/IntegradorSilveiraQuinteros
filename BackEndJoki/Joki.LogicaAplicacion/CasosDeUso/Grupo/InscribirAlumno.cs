using Joki.CasoUsoCompartida.InterfacesCasosUso.Grupo;
using Joki.LogicaNegocio.Entidades;
using Joki.LogicaNegocio.Enums;
using Joki.LogicaNegocio.Excepciones;
using Joki.LogicaNegocio.InterfacesRepositorio;

namespace Joki.LogicaAplicacion.CasosDeUso.Grupo
{
    public class InscribirAlumno : IInscribirAlumno
    {
        private readonly IRepositorioGrupo _repositorioGrupo;
        private readonly IRepositorioAlumno _repositorioAlumno;
        private readonly IRepositorioInscripcion _repositorioInscripcion;
        private readonly IRepositorioListaEspera _repositorioListaEspera;

        public InscribirAlumno(
            IRepositorioGrupo repositorioGrupo,
            IRepositorioAlumno repositorioAlumno,
            IRepositorioInscripcion repositorioInscripcion,
            IRepositorioListaEspera repositorioListaEspera)
        {
            _repositorioGrupo = repositorioGrupo;
            _repositorioAlumno = repositorioAlumno;
            _repositorioInscripcion = repositorioInscripcion;
            _repositorioListaEspera = repositorioListaEspera;
        }

        public string Ejecutar(int alumnoId, int grupoId)
        {
            var alumno = _repositorioAlumno.ObtenerPorId(alumnoId);

            if (alumno == null)
            {
                throw new LogicaNegocioException("Alumno no existe");
            }

            if (alumno.Estado != EstadoUsuario.ACTIVO)
            {
                throw new LogicaNegocioException("Alumno inactivo");
            }

            var grupo = _repositorioGrupo.ObtenerPorId(grupoId);

            if (grupo == null)
            {
                throw new LogicaNegocioException("Grupo no existe");
            }

            if (grupo.Estado != EstadoGrupo.ACTIVO)
            {
                throw new LogicaNegocioException("Grupo inactivo");
            }

            if (_repositorioInscripcion.Existe(alumnoId, grupoId))
            {
                throw new LogicaNegocioException("El alumno ya está inscripto");
            }

            if (_repositorioInscripcion.TieneSuperposicion(alumnoId, grupo))
            {
                throw new LogicaNegocioException("Superposición horaria");
            }

            if (_repositorioListaEspera.Existe(alumnoId, grupoId))
            {
                throw new LogicaNegocioException("Ya está en lista de espera");
            }

            if (_repositorioInscripcion.CantidadPorGrupo(grupoId) >= grupo.CupoMaximo)
            {
                _repositorioListaEspera.Agregar(alumnoId, grupoId);
                return "LISTA_ESPERA";
            }

            var inscripcion = new Inscripcion
            {
                AlumnoId = alumnoId,
                GrupoId = grupoId,
                FechaInscripcion = DateTime.UtcNow
            };

            _repositorioInscripcion.Agregar(inscripcion);

            return "INSCRIPTO";
        }
    }
}