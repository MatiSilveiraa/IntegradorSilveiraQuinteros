using Joki.LogicaNegocio.Entidades;
using Joki.LogicaNegocio.Enums;

namespace Joki.LogicaNegocio.InterfacesRepositorio
{
    public interface IRepositorioSolicitudReactivacion
    {
        void Agregar(SolicitudReactivacion solicitud);

        SolicitudReactivacion? ObtenerPorId(int id);

        SolicitudReactivacion? ObtenerPendientePorAlumno(int alumnoId);

        IEnumerable<SolicitudReactivacion> ObtenerPendientes();

        void Modificar(SolicitudReactivacion solicitud);
    }
}