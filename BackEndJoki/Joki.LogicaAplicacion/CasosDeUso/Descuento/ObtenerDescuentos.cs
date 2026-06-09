using Joki.CasoUsoCompartida.DTOs.Descuento;
using Joki.CasoUsoCompartida.InterfacesCasosUso.Descuento;
using Joki.LogicaNegocio.InterfacesRepositorio;

namespace Joki.LogicaAplicacion.CasosDeUso.Descuento
{
    public class ObtenerDescuentos : IObtenerDescuentos
    {
        private readonly IRepositorioDescuento _repositorioDescuento;

        public ObtenerDescuentos(
            IRepositorioDescuento repositorioDescuento)
        {
            _repositorioDescuento = repositorioDescuento;
        }

        public IEnumerable<DescuentoResponse> Ejecutar()
        {
            var descuentos =
                _repositorioDescuento.ObtenerTodos();

            return descuentos.Select(d =>
                new DescuentoResponse
                {
                    Id = d.Id,
                    Nombre = d.Nombre,
                    Descripcion = d.Descripcion,
                    Porcentaje = d.Porcentaje,
                    MesesDuracion = d.MesesDuracion,
                    Tipo = d.Tipo.ToString(),
                    Alcance = d.Alcance.ToString(),
                    Activo = d.Activo,
                    DesafioId = d.DesafioId
                }).ToList();
        }
    }
}