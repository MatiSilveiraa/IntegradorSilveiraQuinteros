using Joki.CasoUsoCompartida.DTOs.Reactivacion;
using Joki.CasoUsoCompartida.InterfacesCasosUso.Reactivacion;
using Joki.LogicaNegocio.Entidades;
using Joki.LogicaNegocio.Excepciones;
using Joki.LogicaNegocio.InterfacesRepositorio;

namespace Joki.LogicaAplicacion.CasosDeUso.Reactivacion
{
    public class SolicitarReactivacionCuenta :
        ISolicitarReactivacionCuenta
    {
        private readonly IRepositorioAlumno _repositorioAlumno;
        private readonly IRepositorioSolicitudReactivacion _repositorioSolicitud;

        public SolicitarReactivacionCuenta(
            IRepositorioAlumno repositorioAlumno,
            IRepositorioSolicitudReactivacion repositorioSolicitud)
        {
            _repositorioAlumno = repositorioAlumno;
            _repositorioSolicitud = repositorioSolicitud;
        }

        public void Ejecutar(
            int alumnoId,
            SolicitarReactivacionRequest request)
        {
            var alumno =
                _repositorioAlumno.ObtenerPorId(alumnoId);

            if (alumno == null)
            {
                throw new LogicaNegocioException(
                    "Alumno no encontrado");
            }

            if (!alumno.BloqueadoPorInasistencias)
            {
                throw new LogicaNegocioException(
                    "El alumno no se encuentra bloqueado");
            }

            var pendiente =
                _repositorioSolicitud
                    .ObtenerPendientePorAlumno(alumnoId);

            if (pendiente != null)
            {
                throw new LogicaNegocioException(
                    "Ya existe una solicitud pendiente");
            }

            var solicitud =
                new SolicitudReactivacion
                {
                    AlumnoId = alumnoId,
                    MotivoAlumno = request.Motivo
                };

            _repositorioSolicitud.Agregar(
                solicitud);
        }
    }
}