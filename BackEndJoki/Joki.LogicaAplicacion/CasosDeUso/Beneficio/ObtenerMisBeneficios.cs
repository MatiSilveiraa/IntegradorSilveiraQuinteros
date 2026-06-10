using Joki.CasoUsoCompartida.DTOs.Beneficio;
using Joki.CasoUsoCompartida.InterfacesCasosUso.Beneficio;
using Joki.LogicaNegocio.InterfacesRepositorio;

namespace Joki.LogicaAplicacion.CasosDeUso.Beneficio
{
    public class ObtenerMisBeneficios :
        IObtenerMisBeneficios
    {
        private readonly IRepositorioBeneficio _repositorioBeneficio;

        public ObtenerMisBeneficios(
            IRepositorioBeneficio repositorioBeneficio)
        {
            _repositorioBeneficio = repositorioBeneficio;
        }

        public IEnumerable<MiBeneficioResponse> Ejecutar(
            int alumnoId)
        {
            var beneficios =
     _repositorioBeneficio
         .ObtenerPorAlumno(alumnoId)
         .Where(b => b.Estado != LogicaNegocio.Enums.EstadoBeneficio.CANCELADO);

            return beneficios.Select(b =>
            {
                string tipo = "DESCUENTO";

                if (b.CuotaGratis)
                {
                    tipo = "CUOTA_GRATIS";
                }
                else if (b.RecompensaId != null &&
                         b.DescuentoId == null)
                {
                    tipo = "PREMIO_FISICO";
                }

                return new MiBeneficioResponse
                {
                    Id = b.Id,
                    Tipo = tipo,
                    Descripcion = b.DescripcionBeneficio,
                    Estado = b.Estado.ToString(),
                    MesesDuracion = b.MesesDuracion,
                    MesesAplicados = b.MesesAplicados,
                    CuotaGratis = b.CuotaGratis,
                    DescuentoId = b.DescuentoId,
                    PorcentajeDescuento =
                        b.Descuento != null
                            ? b.Descuento.Porcentaje
                            : null,
                    RecompensaId = b.RecompensaId
                };
            }).ToList();
        }
    }
}