using Joki.CasoUsoCompartida.DTOs.Clase;
using Joki.CasoUsoCompartida.InterfacesCasosUso.Grupo;
using Joki.LogicaAplicacion.Helpers;
using Joki.LogicaAplicacion.Mappers;
using Joki.LogicaNegocio.InterfacesRepositorio;

namespace Joki.LogicaAplicacion.CasosDeUso.Clase
{
    public class ObtenerClasesInscripto :
        IObtenerClasesInscripto
    {
        private readonly IRepositorioInscripcion
            _repositorioInscripcion;

        public ObtenerClasesInscripto(
            IRepositorioInscripcion repositorioInscripcion)
        {
            _repositorioInscripcion =
                repositorioInscripcion;
        }

        public List<ClaseResponse> Ejecutar(int alumnoId)
        {
            var ahoraUruguay =
                HorarioUruguayHelper.ObtenerAhora();

            DateTime fechaHoyUruguay =
                ahoraUruguay.Date;

            var inscripciones =
                _repositorioInscripcion
                    .ObtenerPorAlumno(alumnoId);

            return inscripciones
                .Select(inscripcion =>
                {
                    var response =
                        MapperClase.ToResponse(
                            inscripcion.Clase);

                    var asistenciaHoy =
                        inscripcion.Clase.Asistencias
                            .Where(a =>
                                a.AlumnoId == alumnoId &&
                                a.Fecha.Date ==
                                    fechaHoyUruguay.Date)
                            .OrderByDescending(
                                a => a.FechaRegistro)
                            .FirstOrDefault();

                    response.AsistenciaRegistradaHoy =
                        asistenciaHoy != null;

                    response.FechaRegistroAsistencia =
                        asistenciaHoy?.FechaRegistro;

                    response.TipoRegistroAsistencia =
                        asistenciaHoy == null
                            ? null
                            : asistenciaHoy
                                .RegistradaPorGeolocalizacion
                                    ? "GEOLOCALIZACION"
                                    : "MANUAL";

                    return response;
                })
                .ToList();
        }
    }
}