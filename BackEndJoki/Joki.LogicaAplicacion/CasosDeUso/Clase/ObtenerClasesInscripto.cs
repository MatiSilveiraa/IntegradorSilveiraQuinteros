using Joki.CasoUsoCompartida.DTOs.Clase;
using Joki.CasoUsoCompartida.InterfacesCasosUso.Grupo;
using Joki.LogicaAplicacion.Mappers;
using Joki.LogicaNegocio.InterfacesRepositorio;

namespace Joki.LogicaAplicacion.CasosDeUso.Clase
{
    public class ObtenerClasesInscripto : IObtenerClasesInscripto
    {
        private readonly IRepositorioInscripcion _repositorioInscripcion;

        public ObtenerClasesInscripto(IRepositorioInscripcion repositorioInscripcion)
        {
            _repositorioInscripcion = repositorioInscripcion;
        }

        public List<ClaseResponse> Ejecutar(int alumnoId)
        {
            var inscripciones = _repositorioInscripcion.ObtenerPorAlumno(alumnoId);

            return inscripciones
                .Select(i => MapperClase.ToResponse(i.Clase))
                .ToList();
        }
    }
}
