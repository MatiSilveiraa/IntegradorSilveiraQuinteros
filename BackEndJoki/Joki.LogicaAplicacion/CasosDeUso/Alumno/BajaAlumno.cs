using Joki.CasoUsoCompartida.InterfacesCasosUso.Alumno;
using Joki.LogicaNegocio.Enums;
using Joki.LogicaNegocio.InterfacesRepositorio;

namespace Joki.LogicaAplicacion.CasosDeUso.Alumno
{
    public class BajaAlumno : IBajaAlumno
    {
        private readonly IRepositorioAlumno _repo;

        public BajaAlumno(IRepositorioAlumno repo)
        {
            _repo = repo;
        }

        public void Ejecutar(int id)
        {
            var alumno = _repo.ObtenerPorId(id);

            if (alumno == null)
                throw new Exception("Alumno no encontrado");
            alumno.Estado = EstadoUsuario.INACTIVO;

            _repo.Modificar(alumno);
        }
    }
}