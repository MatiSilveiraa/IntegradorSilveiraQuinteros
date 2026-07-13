using Joki.LogicaNegocio.Entidades;

namespace Joki.LogicaNegocio.InterfacesRepositorio
{
    public interface IRepositorioClaseEntrenador
    {
        ClaseEntrenador Agregar(ClaseEntrenador claseEntrenador);

        void AgregarVarios(IEnumerable<ClaseEntrenador> entrenadores);

        bool Existe(int claseId, int entrenadorId);

        ClaseEntrenador? Obtener(int claseId, int entrenadorId);

        IEnumerable<ClaseEntrenador> ObtenerPorClase(int claseId);

        IEnumerable<ClaseEntrenador> ObtenerPorEntrenador(int entrenadorId);

        void Eliminar(int claseId, int entrenadorId);

        // NUEVO
        void EliminarPorClase(int claseId);
    }
}