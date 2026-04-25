using Joki.CasoUsoCompartida.DTOs.Alumno;
using Joki.CasoUsoCompartida.InterfacesCasosUso.Alumno;
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

            return alumnos.Select(a => new DtoAlumno
            {
                Id = a.UsuarioId,
                Nombre = a.Nombre.Valor,
                Apellido = a.Apellido.Valor,
                Email = a.Email.Valor,
                Estado = a.Estado.ToString()
            });
        }
    }
}
