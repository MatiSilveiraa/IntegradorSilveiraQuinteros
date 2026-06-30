using Joki.LogicaNegocio.Entidades;
using Joki.LogicaNegocio.ValueObjects;

namespace Joki.LogicaNegocio.InterfacesRepositorio
{
    public interface IRepositorioGrupo
    {
        Grupo Agregar(Grupo grupo);

        List<Grupo> ObtenerTodos();

        Grupo? ObtenerPorId(int id);

        void Actualizar(Grupo grupo);

        void Eliminar(int id);

        int ContarPorEntrenador(int entrenadorId);

        int ContarAlumnosPorEntrenador(int entrenadorId);

        List<AgendaClaseVO> ObtenerAgendaHoy(int entrenadorId);

        ProximaClaseVO? ObtenerProximaClase(int entrenadorId);

        List<GrupoEntrenadorVO> ObtenerGruposPorEntrenador(
    int entrenadorId);

        GrupoDetalleVO? ObtenerDetalleGrupo(
    int grupoId,
    int entrenadorId);
    }
}