using Joki.CasoUsoCompartida.InterfacesCasosUso.Grupo;
using Joki.LogicaNegocio.Entidades;
using Joki.LogicaNegocio.Excepciones;
using Joki.LogicaNegocio.InterfacesRepositorio;
using System.Linq;

namespace Joki.LogicaAplicacion.CasosDeUso.Grupo
{
    public class DesinscribirAlumno : IDesinscribirAlumno
    {
        private readonly IRepositorioInscripcion _repositorioInscripcion;
        private readonly IRepositorioListaEspera _repositorioListaEspera;
        private readonly IRepositorioAlumno _repositorioAlumno;
        private readonly IRepositorioGrupo _repositorioGrupo;
        private readonly IServicioEmail _servicioEmail;

        public DesinscribirAlumno(
            IRepositorioInscripcion repositorioInscripcion,
            IRepositorioListaEspera repositorioListaEspera,
            IRepositorioAlumno repositorioAlumno,
            IRepositorioGrupo repositorioGrupo,
            IServicioEmail servicioEmail)
        {
            _repositorioInscripcion = repositorioInscripcion;
            _repositorioListaEspera = repositorioListaEspera;
            _repositorioAlumno = repositorioAlumno;
            _repositorioGrupo = repositorioGrupo;
            _servicioEmail = servicioEmail;
        }

        public void Ejecutar(int alumnoId, int grupoId)
        {
            if (!_repositorioInscripcion.Existe(alumnoId, grupoId))
            {
                throw new LogicaNegocioException("El alumno no está inscripto en este grupo");
            }

            _repositorioInscripcion.Remover(alumnoId, grupoId);

            var alumnosEnEspera = _repositorioListaEspera.ObtenerAlumnosEnEspera(grupoId).ToList();

            if (alumnosEnEspera.Any())
            {
                var proximoAlumnoId = alumnosEnEspera.First();
                
                var nuevaInscripcion = new Inscripcion
                {
                    AlumnoId = proximoAlumnoId,
                    GrupoId = grupoId,
                    FechaInscripcion = System.DateTime.UtcNow
                };

                _repositorioInscripcion.Agregar(nuevaInscripcion);
                _repositorioListaEspera.Remover(proximoAlumnoId, grupoId);

                var alumnoHeredado = _repositorioAlumno.ObtenerPorId(proximoAlumnoId);
                var grupo = _repositorioGrupo.ObtenerPorId(grupoId);

                if (alumnoHeredado != null && grupo != null)
                {
                    _servicioEmail.EnviarNotificacionInscripcion(alumnoHeredado.Email.Valor, grupo.Nombre);
                }
            }
        }
    }
}