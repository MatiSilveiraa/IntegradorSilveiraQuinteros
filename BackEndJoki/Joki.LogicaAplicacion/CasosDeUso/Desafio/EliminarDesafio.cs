using Joki.CasoUsoCompartida.InterfacesCasosUso.Desafio;
using Joki.LogicaNegocio.Excepciones;
using Joki.LogicaNegocio.InterfacesRepositorio;

namespace Joki.LogicaAplicacion.CasosDeUso.Desafio
{
    public class EliminarDesafio :
        IEliminarDesafio
    {
        private readonly IRepositorioDesafio _repositorioDesafio;

        public EliminarDesafio(
            IRepositorioDesafio repositorioDesafio)
        {
            _repositorioDesafio = repositorioDesafio;
        }

        public void Ejecutar(int id)
        {
            var desafio =
                _repositorioDesafio.ObtenerPorId(id);

            if (desafio == null || !desafio.Activo)
            {
                throw new LogicaNegocioException(
                    "No existe el desafío");
            }

            desafio.Activo = false;

            _repositorioDesafio.Modificar(desafio);
        }
    }
}