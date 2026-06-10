using Joki.CasoUsoCompartida.DTOs.Recompensa;
using Joki.CasoUsoCompartida.InterfacesCasosUso.Recompensa;
using Joki.LogicaNegocio.InterfacesRepositorio;

namespace Joki.LogicaAplicacion.CasosDeUso.Recompensa
{
    public class ObtenerRecompensasPorDesafio :
        IObtenerRecompensasPorDesafio
    {
        private readonly IRepositorioRecompensa _repositorioRecompensa;

        public ObtenerRecompensasPorDesafio(
            IRepositorioRecompensa repositorioRecompensa)
        {
            _repositorioRecompensa = repositorioRecompensa;
        }

        public IEnumerable<RecompensaResponse> Ejecutar(
            int desafioId)
        {
            return _repositorioRecompensa
                .ObtenerPorDesafio(desafioId)
                .Select(r => new RecompensaResponse
                {
                    Id = r.Id,
                    DesafioId = r.DesafioId,
                    Descripcion = r.Descripcion,
                    Tipo = r.Tipo.ToString(),
                    PremioFisico = r.PremioFisico,
                    DescuentoId = r.DescuentoId,
                    OtorgaCuotaGratis = r.OtorgaCuotaGratis
                });
        }
    }
}