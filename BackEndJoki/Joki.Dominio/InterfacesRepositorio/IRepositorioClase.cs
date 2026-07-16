using Joki.LogicaNegocio.Entidades;
using Joki.LogicaNegocio.ValueObjects;

namespace Joki.LogicaNegocio.InterfacesRepositorio
{
    public interface IRepositorioClase
    {
        Clase Agregar(Clase clase);

        void Actualizar(Clase clase);

        void Eliminar(int id);

        Clase? ObtenerPorId(int id);

        IEnumerable<Clase> ObtenerTodos();

        bool Existe(int id);

        bool TieneConflictoHorario(
            int alumnoId,
            Clase nuevaClase);

        ClaseDetalleVO? ObtenerDetalleClase(
     int claseId,
     int entrenadorId,
     DateTime? fecha = null);

        List<ClaseDetalleVO> ObtenerClasesPorEntrenador(
            int entrenadorId);

        List<Clase> ObtenerDisponiblesParaEntrenador(
    int entrenadorId);


    }
}