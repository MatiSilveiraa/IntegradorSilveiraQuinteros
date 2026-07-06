using Joki.CasoUsoCompartida.DTOs.Clase;
using Joki.CasoUsoCompartida.InterfacesCasosUso.Clase;
using Joki.LogicaNegocio.Excepciones;
using Joki.LogicaNegocio.InterfacesRepositorio;

namespace Joki.LogicaAplicacion.CasosDeUso.Clase
{
    public class ObtenerInscriptosClase :
        IObtenerInscriptosClase
    {
        private readonly IRepositorioClase _repositorioClase;
        private readonly IRepositorioInscripcion _repositorioInscripcion;

        public ObtenerInscriptosClase(
            IRepositorioClase repositorioClase,
            IRepositorioInscripcion repositorioInscripcion)
        {
            _repositorioClase = repositorioClase;
            _repositorioInscripcion = repositorioInscripcion;
        }

        public IEnumerable<AlumnoInscriptoClaseResponse> Ejecutar(int claseId)
        {
            var clase =
                _repositorioClase.ObtenerPorId(claseId);

            if (clase == null)
            {
                throw new LogicaNegocioException(
                    "La clase no existe");
            }

            var inscripciones =
                _repositorioInscripcion.ObtenerPorClase(claseId);

            return inscripciones.Select(i =>
                new AlumnoInscriptoClaseResponse
                {
                    AlumnoId = i.AlumnoId,
                    Nombre = i.Alumno.Nombre.Valor,
                    Apellido = i.Alumno.Apellido.Valor,
                    Email = i.Alumno.Email.Valor,
                    Celular = i.Alumno.Celular?.Valor,
                    EstadoAlumno = i.Alumno.Estado.ToString(),
                    FechaInscripcion = i.FechaInscripcion
                }).ToList();
        }
    }
}