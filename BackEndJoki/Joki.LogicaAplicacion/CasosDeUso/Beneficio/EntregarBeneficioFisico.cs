using Joki.CasoUsoCompartida.InterfacesCasosUso.Beneficio;
using Joki.LogicaNegocio.Enums;
using Joki.LogicaNegocio.Excepciones;
using Joki.LogicaNegocio.InterfacesRepositorio;

namespace Joki.LogicaAplicacion.CasosDeUso.Beneficio
{
    public class EntregarBeneficioFisico :
        IEntregarBeneficioFisico
    {
        private readonly IRepositorioBeneficio _repositorioBeneficio;

        public EntregarBeneficioFisico(
            IRepositorioBeneficio repositorioBeneficio)
        {
            _repositorioBeneficio = repositorioBeneficio;
        }

        public void Ejecutar(int beneficioId)
        {
            var beneficio =
                _repositorioBeneficio.ObtenerPorId(beneficioId);

            if (beneficio == null)
            {
                throw new LogicaNegocioException(
                    "No existe el beneficio");
            }

            if (beneficio.CuotaGratis ||
                beneficio.DescuentoId != null)
            {
                throw new LogicaNegocioException(
                    "Solo se pueden entregar beneficios físicos");
            }

            if (beneficio.Estado != EstadoBeneficio.PENDIENTE)
            {
                throw new LogicaNegocioException(
                    "El beneficio no está pendiente");
            }

            beneficio.Estado = EstadoBeneficio.OTORGADO;

            _repositorioBeneficio.Modificar(beneficio);
        }
    }
}