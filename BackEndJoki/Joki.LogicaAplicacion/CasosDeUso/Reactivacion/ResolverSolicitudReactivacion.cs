using Joki.CasoUsoCompartida.DTOs.Reactivacion;
using Joki.CasoUsoCompartida.InterfacesCasosUso.Reactivacion;
using Joki.LogicaNegocio.Enums;
using Joki.LogicaNegocio.Excepciones;
using Joki.LogicaNegocio.InterfacesRepositorio;

namespace Joki.LogicaAplicacion.CasosDeUso.Reactivacion
{
    public class ResolverSolicitudReactivacion :
        IResolverSolicitudReactivacion
    {
        private readonly IRepositorioSolicitudReactivacion _repositorioSolicitud;
        private readonly IRepositorioAlumno _repositorioAlumno;

        public ResolverSolicitudReactivacion(
            IRepositorioSolicitudReactivacion repositorioSolicitud,
            IRepositorioAlumno repositorioAlumno)
        {
            _repositorioSolicitud = repositorioSolicitud;
            _repositorioAlumno = repositorioAlumno;
        }

        public void Ejecutar(
            int solicitudId,
            int adminId,
            ResolverSolicitudReactivacionRequest request)
        {
            var solicitud =
                _repositorioSolicitud.ObtenerPorId(solicitudId);

            if (solicitud == null)
            {
                throw new LogicaNegocioException(
                    "Solicitud no encontrada");
            }

            if (solicitud.Estado != EstadoSolicitudReactivacion.PENDIENTE)
            {
                throw new LogicaNegocioException(
                    "La solicitud ya fue resuelta");
            }

            var alumno =
                _repositorioAlumno.ObtenerPorId(solicitud.AlumnoId);

            if (alumno == null)
            {
                throw new LogicaNegocioException(
                    "Alumno no encontrado");
            }

            if (request.Aprobar)
            {
                solicitud.Estado =
                    EstadoSolicitudReactivacion.APROBADA;

                alumno.BloqueadoPorInasistencias = false;
                alumno.RachaAsistenciaMensual = 0;

                _repositorioAlumno.Modificar(alumno);
            }
            else
            {
                solicitud.Estado =
                    EstadoSolicitudReactivacion.RECHAZADA;
            }

            solicitud.AdminId = adminId;
            solicitud.RespuestaAdmin = request.RespuestaAdmin;
            solicitud.FechaResolucion = DateTime.UtcNow;

            _repositorioSolicitud.Modificar(solicitud);
        }
    }
}