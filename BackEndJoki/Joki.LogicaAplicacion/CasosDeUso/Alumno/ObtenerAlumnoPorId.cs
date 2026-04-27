using Joki.CasoUsoCompartida.DTOs.Alumno;
using Joki.CasoUsoCompartida.InterfacesCasosUso.Alumno;
using Joki.LogicaNegocio.InterfacesRepositorio;
using Joki.LogicaAplicacion.Mappers;

namespace Joki.LogicaAplicacion.CasosDeUso.Alumno
{
    public class ObtenerAlumnoPorId : IObtenerAlumnoPorId
    {
        private readonly IRepositorioAlumno _repo;

        public ObtenerAlumnoPorId(IRepositorioAlumno repo)
        {
            _repo = repo;
        }

        public DtoAlumno Ejecutar(int id)
        {
            var alumno = _repo.ObtenerPorId(id);

            if (alumno == null)
                throw new Exception("Alumno no encontrado");

            return MapperAlumno.ToDto(alumno);
        }
    }
}
