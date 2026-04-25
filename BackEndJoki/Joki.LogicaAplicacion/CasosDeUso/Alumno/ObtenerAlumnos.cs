using Joki.CasoUsoCompartida.DTOs.Alumno;
using Joki.CasoUsoCompartida.InterfacesCasosUso.Alumno;
using Joki.LogicaAplicacion.Mappers;
using Joki.LogicaNegocio.InterfacesRepositorio;

namespace Joki.LogicaAplicacion.CasosDeUso.Alumno
{
    public class ObtenerAlumnos : IObtenerAlumnos
    {
        private readonly IRepositorioAlumno _repo;

        public ObtenerAlumnos(IRepositorioAlumno repo)
        {
            _repo = repo;
        }

        public IEnumerable<DtoAlumno> Ejecutar()
        {
            var alumnos = _repo.ObtenerTodos();

            return MapperAlumno.ToDtoList(alumnos);
        }
    }
}
