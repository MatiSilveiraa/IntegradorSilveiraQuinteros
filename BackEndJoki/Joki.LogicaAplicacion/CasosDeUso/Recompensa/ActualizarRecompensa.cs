using Joki.CasoUsoCompartida.DTOs.Recompensa;
using Joki.CasoUsoCompartida.InterfacesCasosUso.Recompensa;
using Joki.LogicaNegocio.Enums;
using Joki.LogicaNegocio.Excepciones;
using Joki.LogicaNegocio.InterfacesRepositorio;

namespace Joki.LogicaAplicacion.CasosDeUso.Recompensa
{
    public class ActualizarRecompensa : IActualizarRecompensa
    {
        private readonly IRepositorioRecompensa _repositorioRecompensa;
        private readonly IRepositorioDescuento _repositorioDescuento;

        public ActualizarRecompensa(
            IRepositorioRecompensa repositorioRecompensa,
            IRepositorioDescuento repositorioDescuento)
        {
            _repositorioRecompensa = repositorioRecompensa;
            _repositorioDescuento = repositorioDescuento;
        }

        public void Ejecutar(
            int id,
            ActualizarRecompensaRequest request)
        {
            var recompensa =
                _repositorioRecompensa.ObtenerPorId(id);

            if (recompensa == null || !recompensa.Activo)
            {
                throw new LogicaNegocioException("No existe la recompensa");
            }

            if (string.IsNullOrWhiteSpace(request.Descripcion))
            {
                throw new LogicaNegocioException("La descripción es obligatoria");
            }

            var tipo =
                Enum.Parse<TipoRecompensa>(request.Tipo, true);

            if (request.DescuentoId != null)
            {
                var descuento =
                    _repositorioDescuento.ObtenerPorId(request.DescuentoId.Value);

                if (descuento == null || !descuento.Activo)
                {
                    throw new LogicaNegocioException("No existe el descuento");
                }
            }

            recompensa.Descripcion = request.Descripcion;
            recompensa.Tipo = tipo;
            recompensa.PremioFisico = request.PremioFisico;
            recompensa.DescuentoId = request.DescuentoId;
            recompensa.OtorgaCuotaGratis = request.OtorgaCuotaGratis;

            _repositorioRecompensa.Modificar(recompensa);
        }
    }
}