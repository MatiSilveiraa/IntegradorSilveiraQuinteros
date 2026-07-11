using Joki.CasoUsoCompartida.DTOs.Asistencia;
using Joki.CasoUsoCompartida.InterfacesCasosUso.Asistencia;
using Joki.LogicaAplicacion.Helpers;
using Joki.LogicaNegocio.Enums;
using Joki.LogicaNegocio.Excepciones;
using Joki.LogicaNegocio.InterfacesRepositorio;

using AsistenciaEntidad =
    Joki.LogicaNegocio.Entidades.Asistencia;

using ClaseEntidad =
    Joki.LogicaNegocio.Entidades.Clase;

namespace Joki.LogicaAplicacion.CasosDeUso.Asistencia
{
    public class RegistrarAsistenciaGeolocalizacion :
        IRegistrarAsistenciaGeolocalizacion
    {
        private readonly IRepositorioAsistencia
            _repoAsistencia;

        private readonly IRepositorioClase
            _repoClase;

        private readonly IRepositorioAlumno
            _repoAlumno;

        private readonly IRepositorioInscripcion
            _repoInscripcion;

        private readonly IRepositorioCuota
            _repoCuota;

        public RegistrarAsistenciaGeolocalizacion(
            IRepositorioAsistencia repoAsistencia,
            IRepositorioClase repoClase,
            IRepositorioAlumno repoAlumno,
            IRepositorioInscripcion repoInscripcion,
            IRepositorioCuota repoCuota)
        {
            _repoAsistencia = repoAsistencia;
            _repoClase = repoClase;
            _repoAlumno = repoAlumno;
            _repoInscripcion = repoInscripcion;
            _repoCuota = repoCuota;
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
                _repoClase.ObtenerPorId(
                    request.ClaseId);

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

            DateTimeOffset ahoraUruguay =
                HorarioUruguayHelper.ObtenerAhora();

            ValidarHorarioClase(
                clase,
                ahoraUruguay);

            DateTime fechaActualUruguay =
                ahoraUruguay.Date;

            bool yaExiste =
                _repoAsistencia.ExisteAsistencia(
                    alumnoId,
                    request.ClaseId,
                    fechaActualUruguay);

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

            if (distancia >
                clase.RadioGeolocalizacion)
            {
                throw new LogicaNegocioException(
                    "No estás dentro del radio permitido para marcar asistencia");
            }

            var asistencia =
                new AsistenciaEntidad
                {
                    AlumnoId = alumnoId,
                    ClaseId = request.ClaseId,
                    Fecha = fechaActualUruguay,
                    FechaRegistro = DateTime.UtcNow,
                    Presente = true,
                    RegistradoPorId = alumnoId,
                    Latitud = request.Latitud,
                    Longitud = request.Longitud,
                    DistanciaMetros = distancia,
                    RegistradaPorGeolocalizacion = true
                };

            _repoAsistencia.Agregar(
                asistencia);

            ActualizarRachaAlumno(
                alumno,
                ahoraUruguay);
        }

        private void ActualizarRachaAlumno(
            Joki.LogicaNegocio.Entidades.Alumno alumno,
            DateTimeOffset ahoraUruguay)
        {
            int mesActual =
                ahoraUruguay.Month;

            int anioActual =
                ahoraUruguay.Year;

            if (alumno.MesRachaAsistencia != mesActual ||
                alumno.AnioRachaAsistencia != anioActual)
            {
                alumno.RachaAsistenciaMensual = 0;
                alumno.DescuentoRachaGenerado = false;
                alumno.MesRachaAsistencia = mesActual;
                alumno.AnioRachaAsistencia = anioActual;
            }

            alumno.RachaAsistenciaMensual++;

            if (alumno.RachaAsistenciaMensual >= 10 &&
                !alumno.DescuentoRachaGenerado)
            {
                alumno.DescuentoRachaGenerado = true;

                decimal montoBase = 1390m;

                decimal descuento =
                    montoBase * 0.10m;

                decimal montoFinal =
                    montoBase - descuento;

                var cuota =
                    _repoCuota.ObtenerPorAlumnoMesYAnio(
                        alumno.UsuarioId,
                        mesActual,
                        anioActual);

                if (cuota != null)
                {
                    cuota.Descuento =
                        descuento;

                    cuota.MontoFinal =
                        montoFinal;

                    _repoCuota.Modificar(
                        cuota);
                }
            }

            _repoAlumno.Modificar(
                alumno);
        }

        private static void ValidarHorarioClase(
            ClaseEntidad clase,
            DateTimeOffset ahoraUruguay)
        {
            if (ConvertirDia(clase.DiaSemana) !=
                ahoraUruguay.DayOfWeek)
            {
                throw new LogicaNegocioException(
                    "La clase no corresponde al día de hoy");
            }

            TimeSpan horaActual =
                ahoraUruguay.TimeOfDay;

            TimeSpan inicioPermitido =
                clase.HoraInicio.Subtract(
                    TimeSpan.FromMinutes(5));

            TimeSpan finPermitido =
                clase.HoraFin;

            if (horaActual < inicioPermitido ||
                horaActual > finPermitido)
            {
                throw new LogicaNegocioException(
                    $"Podés registrar asistencia entre " +
                    $"{inicioPermitido:hh\\:mm} y " +
                    $"{finPermitido:hh\\:mm}.");
            }
        }

        private static DayOfWeek ConvertirDia(
            DiaSemana dia)
        {
            return dia switch
            {
                DiaSemana.Lunes =>
                    DayOfWeek.Monday,

                DiaSemana.Martes =>
                    DayOfWeek.Tuesday,

                DiaSemana.Miercoles =>
                    DayOfWeek.Wednesday,

                DiaSemana.Jueves =>
                    DayOfWeek.Thursday,

                DiaSemana.Viernes =>
                    DayOfWeek.Friday,

                DiaSemana.Sabado =>
                    DayOfWeek.Saturday,

                DiaSemana.Domingo =>
                    DayOfWeek.Sunday,

                _ => throw new LogicaNegocioException(
                    "El día de la clase no es válido")
            };
        }

        private static decimal CalcularDistanciaMetros(
            decimal lat1,
            decimal lon1,
            decimal lat2,
            decimal lon2)
        {
            const double radioTierra =
                6371000;

            double latitud1 =
                GradosARadianes(
                    (double)lat1);

            double latitud2 =
                GradosARadianes(
                    (double)lat2);

            double diferenciaLatitud =
                GradosARadianes(
                    (double)(lat2 - lat1));

            double diferenciaLongitud =
                GradosARadianes(
                    (double)(lon2 - lon1));

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

            return (decimal)Math.Round(
                distancia,
                2);
        }

        private static double GradosARadianes(
            double grados)
        {
            return grados *
                Math.PI / 180;
        }
    }
}