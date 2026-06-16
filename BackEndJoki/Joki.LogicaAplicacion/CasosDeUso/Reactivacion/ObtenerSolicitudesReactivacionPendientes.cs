using Joki.CasoUsoCompartida.DTOs.Reactivacion;
using Joki.CasoUsoCompartida.InterfacesCasosUso.Reactivacion;
using Joki.LogicaNegocio.InterfacesRepositorio;

namespace Joki.LogicaAplicacion.CasosDeUso.Reactivacion
{
    public class ObtenerSolicitudesReactivacionPendientes :
        IObtenerSolicitudesReactivacionPendientes
    {
        private readonly IRepositorioSolicitudReactivacion _repositorioSolicitud;

        public ObtenerSolicitudesReactivacionPendientes(
            IRepositorioSolicitudReactivacion repositorioSolicitud)
        {
            _repositorioSolicitud = repositorioSolicitud;
        }

        public IEnumerable<SolicitudReactivacionResponse> Ejecutar()
        {
            var solicitudes =
                _repositorioSolicitud.ObtenerPendientes();

            return solicitudes.Select(s =>
                new SolicitudReactivacionResponse
                {
                    Id = s.Id,
                    AlumnoId = s.AlumnoId,
                    NombreAlumno =
                        $"{s.Alumno.Nombre.Valor} {s.Alumno.Apellido.Valor}",
                    FechaSolicitud = s.FechaSolicitud,
                    Estado = s.Estado.ToString(),
                    MotivoAlumno = s.MotivoAlumno
                });
        }
    }
}