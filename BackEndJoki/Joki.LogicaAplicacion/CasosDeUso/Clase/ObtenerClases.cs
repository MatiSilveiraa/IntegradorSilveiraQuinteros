using Joki.CasoUsoCompartida.DTOs.Clase;
using Joki.CasoUsoCompartida.InterfacesCasosUso.Clase;
using Joki.LogicaAplicacion.Mappers;
using Joki.LogicaNegocio.InterfacesRepositorio;

namespace Joki.LogicaAplicacion.CasosDeUso.Clase
{
    public class ObtenerClases : IObtenerClases
    {
        private readonly IRepositorioClase _repositorioClase;

        public ObtenerClases(
            IRepositorioClase repositorioClase)
        {
            _repositorioClase = repositorioClase;
        }

        public IEnumerable<ClaseResponse> Ejecutar()
        {
            var clases =
                _repositorioClase.ObtenerTodos();

            return clases.Select(
                MapperClase.ToResponse);
        }
    }
}