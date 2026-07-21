using Joki.LogicaNegocio.Entidades;

namespace Joki.LogicaNegocio.InterfacesRepositorio
{
    public interface IRepositorioListaEspera
    {
        void Agregar(int alumnoId, int claseId);

        bool Existe(int alumnoId, int claseId);

        IEnumerable<int> ObtenerAlumnosEnEspera(int claseId);

        void Remover(int alumnoId, int claseId);

        IEnumerable<ListaEspera> ObtenerPorClase(int claseId);
    }
}