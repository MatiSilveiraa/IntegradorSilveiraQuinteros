using Joki.CasoUsoCompartida.DTOs.Descuento;
using Joki.CasoUsoCompartida.InterfacesCasosUso.Descuento;
using Joki.LogicaNegocio.Excepciones;
using Joki.LogicaNegocio.InterfacesRepositorio;

namespace Joki.LogicaAplicacion.CasosDeUso.Descuento
{
    public class ObtenerDescuentoPorId :
        IObtenerDescuentoPorId
    {
        private readonly IRepositorioDescuento _repositorioDescuento;

        public ObtenerDescuentoPorId(
            IRepositorioDescuento repositorioDescuento)
        {
            _repositorioDescuento = repositorioDescuento;
        }

        public DescuentoResponse Ejecutar(int id)
        {
            var descuento =
                _repositorioDescuento.ObtenerPorId(id);

            if (descuento == null)
            {
                throw new LogicaNegocioException(
                    "No existe el descuento");
            }

            return new DescuentoResponse
            {
                Id = descuento.Id,
                Nombre = descuento.Nombre,
                Descripcion = descuento.Descripcion,
                Porcentaje = descuento.Porcentaje,
                MesesDuracion = descuento.MesesDuracion,
                Tipo = descuento.Tipo.ToString(),
                Alcance = descuento.Alcance.ToString(),
                Activo = descuento.Activo,
                DesafioId = descuento.DesafioId
            };
        }
    }
}