

namespace Joki.LogicaNegocio.InterfacesRepositorio
{
    public interface IRepositorioListaEspera
    {
        void Agregar(int alumnoId, int grupoId);

        bool Existe(int alumnoId, int grupoId);

        IEnumerable<int> ObtenerAlumnosEnEspera(int grupoId);

        void Remover(int alumnoId, int grupoId);
    }
}
