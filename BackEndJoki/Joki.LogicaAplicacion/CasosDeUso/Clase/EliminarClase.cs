using Joki.CasoUsoCompartida.InterfacesCasosUso.Clase;
using Joki.LogicaNegocio.Excepciones;
using Joki.LogicaNegocio.InterfacesRepositorio;

namespace Joki.LogicaAplicacion.CasosDeUso.Clase
{
    public class EliminarClase : IEliminarClase
    {
        private readonly IRepositorioClase _repositorioClase;

        public EliminarClase(
            IRepositorioClase repositorioClase)
        {
            _repositorioClase = repositorioClase;
        }

        public void Ejecutar(int id)
        {
            var clase =
                _repositorioClase.ObtenerPorId(id);

            if (clase == null)
            {
                throw new LogicaNegocioException(
                    "La clase no existe");
            }

            _repositorioClase.Eliminar(id);
        }
    }
}