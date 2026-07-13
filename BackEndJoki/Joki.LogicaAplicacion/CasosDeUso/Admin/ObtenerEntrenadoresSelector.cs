using Joki.CasoUsoCompartida.DTOs.Admin;
using Joki.CasoUsoCompartida.DTOs.Entrenador;
using Joki.CasoUsoCompartida.InterfacesCasosUso.Admin;
using Joki.LogicaNegocio.InterfacesRepositorio;

namespace Joki.LogicaAplicacion.CasosDeUso.Admin
{
    public class ObtenerEntrenadoresSelector :
        IObtenerEntrenadoresSelector
    {
        private readonly IRepositorioEntrenador _repositorioEntrenador;

        public ObtenerEntrenadoresSelector(
            IRepositorioEntrenador repositorioEntrenador)
        {
            _repositorioEntrenador = repositorioEntrenador;
        }

        public IEnumerable<EntrenadorSelectResponse> Ejecutar()
        {
            return _repositorioEntrenador
                .ObtenerActivos()
                .Select(e => new EntrenadorSelectResponse
                {
                    Id = e.UsuarioId,
                    NombreCompleto =
                        $"{e.Nombre.Valor} {e.Apellido.Valor}"
                })
                .ToList();
        }
    }
}