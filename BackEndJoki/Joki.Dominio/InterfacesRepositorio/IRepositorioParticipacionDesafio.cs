using Joki.LogicaNegocio.Entidades;

namespace Joki.LogicaNegocio.InterfacesRepositorio
{
    public interface IRepositorioParticipacionDesafio
    {
        void Agregar(ParticipacionDesafio participacion);

        void Modificar(ParticipacionDesafio participacion);
        IEnumerable<ParticipacionDesafio> ObtenerGanadoresPorDesafio(
    int desafioId);

        IEnumerable<ParticipacionDesafio> ObtenerParticipantesPorDesafio(
    int desafioId);

        IEnumerable<ParticipacionDesafio> ObtenerPorAlumno(
    int alumnoId);

        ParticipacionDesafio? Obtener(
            int alumnoId,
            int desafioId);
    }
}