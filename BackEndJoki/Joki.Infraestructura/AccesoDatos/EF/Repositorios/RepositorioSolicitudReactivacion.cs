using Joki.LogicaNegocio.Entidades;
using Joki.LogicaNegocio.Enums;
using Joki.LogicaNegocio.InterfacesRepositorio;
using Microsoft.EntityFrameworkCore;

namespace Joki.Infraestructura.AccesoDatos.EF.Repositorios
{
    public class RepositorioSolicitudReactivacion :
        IRepositorioSolicitudReactivacion
    {
        private readonly JokiContext _contexto;

        public RepositorioSolicitudReactivacion(
            JokiContext contexto)
        {
            _contexto = contexto;
        }

        public void Agregar(
            SolicitudReactivacion solicitud)
        {
            _contexto.SolicitudesReactivacion.Add(solicitud);

            _contexto.SaveChanges();
        }

        public SolicitudReactivacion? ObtenerPorId(int id)
        {
            return _contexto.SolicitudesReactivacion
                .Include(s => s.Alumno)
                .FirstOrDefault(s => s.Id == id);
        }

        public SolicitudReactivacion? ObtenerPendientePorAlumno(
            int alumnoId)
        {
            return _contexto.SolicitudesReactivacion
                .FirstOrDefault(s =>
                    s.AlumnoId == alumnoId &&
                    s.Estado == EstadoSolicitudReactivacion.PENDIENTE);
        }

        public IEnumerable<SolicitudReactivacion> ObtenerPendientes()
        {
            return _contexto.SolicitudesReactivacion
                .Include(s => s.Alumno)
                .Where(s =>
                    s.Estado == EstadoSolicitudReactivacion.PENDIENTE)
                .OrderBy(s => s.FechaSolicitud)
                .ToList();
        }

        public void Modificar(
            SolicitudReactivacion solicitud)
        {
            _contexto.SolicitudesReactivacion.Update(solicitud);

            _contexto.SaveChanges();
        }
    }
}