using Joki.CasoUsoCompartida.DTOs.Recompensa;
using Joki.CasoUsoCompartida.InterfacesCasosUso.Recompensa;
using Joki.LogicaNegocio.Enums;
using Joki.LogicaNegocio.Excepciones;
using Joki.LogicaNegocio.InterfacesRepositorio;

using Entidades = Joki.LogicaNegocio.Entidades;

namespace Joki.LogicaAplicacion.CasosDeUso.Recompensa
{
    public class CrearRecompensa :
        ICrearRecompensa
    {
        private readonly IRepositorioRecompensa _repositorioRecompensa;
        private readonly IRepositorioDesafio _repositorioDesafio;
        private readonly IRepositorioDescuento _repositorioDescuento;

        public CrearRecompensa(
            IRepositorioRecompensa repositorioRecompensa,
            IRepositorioDesafio repositorioDesafio,
            IRepositorioDescuento repositorioDescuento)
        {
            _repositorioRecompensa = repositorioRecompensa;
            _repositorioDesafio = repositorioDesafio;
            _repositorioDescuento = repositorioDescuento;
        }

        public void Ejecutar(
            CrearRecompensaRequest request)
        {
            var desafio =
                _repositorioDesafio.ObtenerPorId(request.DesafioId);

            if (desafio == null || !desafio.Activo)
            {
                throw new LogicaNegocioException(
                    "No existe el desafío");
            }

            if (string.IsNullOrWhiteSpace(request.Descripcion))
            {
                throw new LogicaNegocioException(
                    "La descripción es obligatoria");
            }

            TipoRecompensa tipo =
                Enum.Parse<TipoRecompensa>(
                    request.Tipo,
                    true);

            if (request.DescuentoId != null)
            {
                var descuento =
                    _repositorioDescuento.ObtenerPorId(
                        request.DescuentoId.Value);

                if (descuento == null || !descuento.Activo)
                {
                    throw new LogicaNegocioException(
                        "No existe el descuento");
                }
            }

            var recompensa =
                new Entidades.Recompensa
                {
                    DesafioId = request.DesafioId,
                    Descripcion = request.Descripcion,
                    Tipo = tipo,
                    PremioFisico = request.PremioFisico,
                    DescuentoId = request.DescuentoId,
                    OtorgaCuotaGratis = request.OtorgaCuotaGratis
                };

            _repositorioRecompensa.Agregar(
                recompensa);
        }
    }
}