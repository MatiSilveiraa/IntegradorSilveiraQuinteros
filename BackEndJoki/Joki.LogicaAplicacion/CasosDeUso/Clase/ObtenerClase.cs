using Joki.CasoUsoCompartida.DTOs.Clase;
using Joki.CasoUsoCompartida.InterfacesCasosUso.Clase;
using Joki.LogicaAplicacion.Mappers;
using Joki.LogicaNegocio.Excepciones;
using Joki.LogicaNegocio.InterfacesRepositorio;

namespace Joki.LogicaAplicacion.CasosDeUso.Clase
{
    public class ObtenerClase : IObtenerClase
    {
        private readonly IRepositorioClase _repositorioClase;

        public ObtenerClase(
            IRepositorioClase repositorioClase)
        {
            _repositorioClase = repositorioClase;
        }

        public ClaseResponse Ejecutar(int id)
        {
            var clase =
                _repositorioClase.ObtenerPorId(id);

            if (clase == null)
            {
                throw new LogicaNegocioException(
                    "La clase no existe");
            }

            return MapperClase.ToResponse(clase);
        }
    }
}