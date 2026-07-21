using Joki.CasoUsoCompartida.DTOs.Clase;
using Joki.CasoUsoCompartida.InterfacesCasosUso.Clase;
using Joki.LogicaNegocio.Excepciones;
using Joki.LogicaNegocio.InterfacesRepositorio;

namespace Joki.LogicaAplicacion.CasosDeUso.Clase
{
    public class ObtenerListaEsperaClase :
        IObtenerListaEsperaClase
    {
        private readonly IRepositorioClase _repositorioClase;
        private readonly IRepositorioListaEspera _repositorioListaEspera;

        public ObtenerListaEsperaClase(
            IRepositorioClase repositorioClase,
            IRepositorioListaEspera repositorioListaEspera)
        {
            _repositorioClase = repositorioClase;
            _repositorioListaEspera = repositorioListaEspera;
        }

        public IEnumerable<AlumnoListaEsperaResponse> Ejecutar(int claseId)
        {
            var clase = _repositorioClase.ObtenerPorId(claseId);

            if (clase == null)
            {
                throw new LogicaNegocioException(
                    "La clase no existe");
            }

            var lista =
                _repositorioListaEspera
                    .ObtenerPorClase(claseId)
                    .ToList();

            return lista.Select((item, index) =>
                new AlumnoListaEsperaResponse
                {
                    AlumnoId = item.AlumnoId,
                    Nombre = item.Alumno.Nombre.Valor,
                    Apellido = item.Alumno.Apellido.Valor,
                    Email = item.Alumno.Email.Valor,
                    Celular = item.Alumno.Celular?.Valor,
                    EstadoAlumno = item.Alumno.Estado.ToString(),
                    FechaSolicitud = item.FechaSolicitud,
                    Posicion = index + 1
                });
        }
    }
}