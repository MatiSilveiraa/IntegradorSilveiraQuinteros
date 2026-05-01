using Joki.CasoUsoCompartida.InterfacesCasosUso.Grupo;
using Joki.LogicaNegocio.Entidades;
using Joki.LogicaNegocio.Enums;
using Joki.LogicaNegocio.InterfacesRepositorio;

namespace Joki.LogicaAplicacion.CasosDeUso.Grupo
{
    public class InscribirAlumno:IInscribirAlumno
    {
        private readonly IRepositorioGrupo _repositorioGrupo;
        private readonly IRepositorioAlumno _repositorioAlumno;
        private readonly IRepositorioInscripcion _repositorioInscripcion;
        private readonly IRepositorioListaEspera _repositorioListaEspera;

        public InscribirAlumno(IRepositorioGrupo repositorioGrupo, IRepositorioAlumno repositorioAlumno, IRepositorioInscripcion repositorioInscripcion, IRepositorioListaEspera repositorioListaEspera)
        {
            _repositorioGrupo = repositorioGrupo;
            _repositorioAlumno = repositorioAlumno;
            _repositorioInscripcion = repositorioInscripcion;
            _repositorioListaEspera = repositorioListaEspera;
        }

        public void Ejecutar(int alumnoId, int grupoId)
        {
            var alumno = _repositorioAlumno.ObtenerPorId(alumnoId);
            if (alumno == null)
                throw new Exception("Alumno no existe");

            if (alumno.Estado != EstadoUsuario.ACTIVO)
                throw new Exception("Alumno inactivo");

            var grupo = _repositorioGrupo.ObtenerPorId(grupoId);
            if (grupo == null)
                throw new Exception("Grupo no existe");

            if (_repositorioInscripcion.Existe(alumnoId, grupoId))
                throw new Exception("El alumno ya está inscripto");

            var tieneCruce = _repositorioInscripcion.TieneSuperposicion(alumnoId, grupo);
            if (tieneCruce)
                throw new Exception("Superposición horaria");

            if (_repositorioListaEspera.Existe(alumnoId, grupoId))
                throw new Exception("Ya está en lista de espera");

            if (_repositorioInscripcion.CantidadPorGrupo(grupoId) >= grupo.CupoMaximo)
            {
                _repositorioListaEspera.Agregar(alumnoId, grupoId);
                return;
            }

            var inscripcion = new Inscripcion
            {
                AlumnoId = alumnoId,
                GrupoId = grupoId,
                FechaInscripcion = DateTime.Now
            };

            _repositorioInscripcion.Agregar(inscripcion);
        }
    }
}
