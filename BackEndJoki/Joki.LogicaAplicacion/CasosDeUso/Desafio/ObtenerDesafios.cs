using Joki.CasoUsoCompartida.DTOs.Desafio;
using Joki.CasoUsoCompartida.InterfacesCasosUso.Desafio;
using Joki.LogicaNegocio.InterfacesRepositorio;

namespace Joki.LogicaAplicacion.CasosDeUso.Desafio
{
    public class ObtenerDesafios :
        IObtenerDesafios
    {
        private readonly IRepositorioDesafio _repositorioDesafio;

        public ObtenerDesafios(
            IRepositorioDesafio repositorioDesafio)
        {
            _repositorioDesafio =
                repositorioDesafio;
        }

        public IEnumerable<DesafioResponse>
            Ejecutar()
        {
            return _repositorioDesafio
                .ObtenerActivos()
                .Select(d => new DesafioResponse
                {
                    Id = d.Id,
                    Titulo = d.Titulo,
                    Descripcion = d.Descripcion,
                    FechaInicio = d.FechaInicio,
                    FechaFin = d.FechaFin
                });
        }
    }
}