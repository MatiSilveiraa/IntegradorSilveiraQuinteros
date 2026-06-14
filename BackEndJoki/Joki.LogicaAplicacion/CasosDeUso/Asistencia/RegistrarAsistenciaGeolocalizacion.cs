using Joki.CasoUsoCompartida.DTOs.Asistencia;
using Joki.CasoUsoCompartida.InterfacesCasosUso.Asistencia;
using Joki.LogicaNegocio.Enums;
using Joki.LogicaNegocio.Excepciones;
using Joki.LogicaNegocio.InterfacesRepositorio;
using AsistenciaEntidad = Joki.LogicaNegocio.Entidades.Asistencia;
using ClaseEntidad = Joki.LogicaNegocio.Entidades.Clase;

namespace Joki.LogicaAplicacion.CasosDeUso.Asistencia
{
    public class RegistrarAsistenciaGeolocalizacion :
        IRegistrarAsistenciaGeolocalizacion
    {
        private readonly IRepositorioAsistencia _repoAsistencia;
        private readonly IRepositorioClase _repoClase;
        private readonly IRepositorioAlumno _repoAlumno;
        private readonly IRepositorioInscripcion _repoInscripcion;

        public RegistrarAsistenciaGeolocalizacion(
            IRepositorioAsistencia repoAsistencia,
            IRepositorioClase repoClase,
            IRepositorioAlumno repoAlumno,
            IRepositorioInscripcion repoInscripcion)
        {
            _repoAsistencia = repoAsistencia;
            _repoClase = repoClase;
            _repoAlumno = repoAlumno;
            _repoInscripcion = repoInscripcion;
        }

        public void Ejecutar(
            RegistrarAsistenciaGeolocalizacionRequest request,
            int alumnoId)
        {
            if (request == null)
            {
                throw new LogicaNegocioException(
                    "Los datos de asistencia no pueden ser nulos");
            }

            var alumno =
                _repoAlumno.ObtenerPorId(alumnoId);

            if (alumno == null)
            {
                throw new LogicaNegocioException(
                    "Alumno no encontrado");
            }

            var clase =
                _repoClase.ObtenerPorId(request.ClaseId);

            if (clase == null)
            {
                throw new LogicaNegocioException(
                    "Clase no encontrada");
            }

            bool estaInscripto =
                _repoInscripcion.Existe(
                    alumnoId,
                    request.ClaseId);

            if (!estaInscripto)
            {
                throw new LogicaNegocioException(
                    "El alumno no está inscripto a esta clase");
            }

            ValidarHorarioClase(clase);

            bool yaExiste =
                _repoAsistencia.ExisteAsistencia(
                    alumnoId,
                    request.ClaseId,
                    DateTime.Now.Date);

            if (yaExiste)
            {
                throw new LogicaNegocioException(
                    "La asistencia ya fue registrada");
            }

            decimal distancia =
                CalcularDistanciaMetros(
                    clase.Ubicacion.Latitud,
                    clase.Ubicacion.Longitud,
                    request.Latitud,
                    request.Longitud);

            if (distancia > clase.RadioGeolocalizacion)
            {
                throw new LogicaNegocioException(
                    "No estás dentro del radio permitido para marcar asistencia");
            }

            var asistencia =
                new AsistenciaEntidad
    {
                    AlumnoId = alumnoId,
                    ClaseId = request.ClaseId,
                    Fecha = DateTime.Now.Date,
                    FechaRegistro = DateTime.Now,
                    Presente = true,
                    RegistradoPorId = alumnoId,
                    Latitud = request.Latitud,
                    Longitud = request.Longitud,
                    DistanciaMetros = distancia,
                    RegistradaPorGeolocalizacion = true
                };

            _repoAsistencia.Agregar(asistencia);
        }

        private static void ValidarHorarioClase(
     ClaseEntidad clase)
        {
            var ahora =
                DateTime.Now;

            if (ConvertirDia(clase.DiaSemana) != ahora.DayOfWeek)
            {
                throw new LogicaNegocioException(
                    "La clase no corresponde al día de hoy");
            }

            TimeSpan horaActual =
                ahora.TimeOfDay;

            TimeSpan inicioPermitido =
                clase.HoraInicio.Add(
                    TimeSpan.FromMinutes(-15));

            TimeSpan finPermitido =
                clase.HoraInicio.Add(
                    TimeSpan.FromMinutes(30));

            if (horaActual < inicioPermitido ||
                horaActual > finPermitido)
            {
                throw new LogicaNegocioException(
                    "La asistencia solo puede marcarse cerca del horario de inicio de la clase");
            }
        }

        private static DayOfWeek ConvertirDia(
            DiaSemana dia)
        {
            return dia switch
            {
                DiaSemana.Lunes => DayOfWeek.Monday,
                DiaSemana.Martes => DayOfWeek.Tuesday,
                DiaSemana.Miercoles => DayOfWeek.Wednesday,
                DiaSemana.Jueves => DayOfWeek.Thursday,
                DiaSemana.Viernes => DayOfWeek.Friday,
                DiaSemana.Sabado => DayOfWeek.Saturday,
                DiaSemana.Domingo => DayOfWeek.Sunday,
                _ => throw new Exception("Día inválido")
            };
        }

        private static decimal CalcularDistanciaMetros(
            decimal lat1,
            decimal lon1,
            decimal lat2,
            decimal lon2)
        {
            const double radioTierra = 6371000;

            double latitud1 =
                GradosARadianes((double)lat1);

            double latitud2 =
                GradosARadianes((double)lat2);

            double diferenciaLatitud =
                GradosARadianes((double)(lat2 - lat1));

            double diferenciaLongitud =
                GradosARadianes((double)(lon2 - lon1));

            double a =
                Math.Sin(diferenciaLatitud / 2) *
                Math.Sin(diferenciaLatitud / 2) +
                Math.Cos(latitud1) *
                Math.Cos(latitud2) *
                Math.Sin(diferenciaLongitud / 2) *
                Math.Sin(diferenciaLongitud / 2);

            double c =
                2 * Math.Atan2(
                    Math.Sqrt(a),
                    Math.Sqrt(1 - a));

            double distancia =
                radioTierra * c;

            return (decimal)Math.Round(distancia, 2);
        }

        private static double GradosARadianes(double grados)
        {
            return grados * Math.PI / 180;
        }
    }
}
