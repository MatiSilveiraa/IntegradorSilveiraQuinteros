using Joki.LogicaNegocio.Entidades;
using Joki.LogicaNegocio.Enums;
using Joki.LogicaNegocio.ValueObjects;

namespace Joki.LogicaNegocio.InterfacesRepositorio
{
    public interface IRepositorioClaseEntrenador
    {
        void Agregar(
            ClaseEntrenador relacion);

        void AgregarVarios(
            IEnumerable<ClaseEntrenador> relaciones);

        void Modificar(
            ClaseEntrenador relacion);

        void Eliminar(
            ClaseEntrenador relacion);

        void EliminarPorClase(
            int claseId);

        ClaseEntrenador? Obtener(
            int claseId,
            int entrenadorId);

        List<ClaseEntrenador> ObtenerPorClase(
            int claseId);

        List<ClaseEntrenador> ObtenerPorEntrenador(
            int entrenadorId);

        List<ConflictoEntrenadorVO> ObtenerConflictos(
            IEnumerable<int> entrenadoresIds,
            DiaSemana diaSemana,
            TimeSpan horaInicio,
            TimeSpan horaFin,
            DateTime fechaInicio,
            DateTime? fechaFin,
            int? claseExcluirId = null);
    }
}