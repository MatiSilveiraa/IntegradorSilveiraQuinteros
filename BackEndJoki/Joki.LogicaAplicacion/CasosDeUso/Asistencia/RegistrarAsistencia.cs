using Joki.CasoUsoCompartida.DTOs.Asistencia;
using Joki.CasoUsoCompartida.InterfacesCasosUso.Asistencia;
using Joki.LogicaAplicacion.Helpers;
using Joki.LogicaNegocio.Enums;
using Joki.LogicaNegocio.Excepciones;
using Joki.LogicaNegocio.InterfacesRepositorio;

using AsistenciaEntidad =
    Joki.LogicaNegocio.Entidades.Asistencia;

namespace Joki.LogicaAplicacion.CasosDeUso.GestionAsistencias
{
    public class RegistrarAsistencia :
        IRegistrarAsistencia
    {
        private readonly IRepositorioAsistencia
            _repoAsistencia;

        private readonly IRepositorioClase
            _repoClase;

        private readonly IRepositorioAlumno
            _repoAlumno;

        private readonly IRepositorioCuota
            _repoCuota;

        public RegistrarAsistencia(
            IRepositorioAsistencia repoAsistencia,
            IRepositorioClase repoClase,
            IRepositorioAlumno repoAlumno,
            IRepositorioCuota repoCuota)
        {
            _repoAsistencia =
                repoAsistencia;

            _repoClase =
                repoClase;

            _repoAlumno =
                repoAlumno;

            _repoCuota =
                repoCuota;
        }

        public void Ejecutar(
            RegistrarAsistenciaRequest request,
            int usuarioId)
        {
            if (request == null)
            {
                throw new LogicaNegocioException(
                    "Los datos de asistencia no pueden ser nulos");
            }

            if (request.AlumnoId <= 0)
            {
                throw new LogicaNegocioException(
                    "El alumno es obligatorio");
            }

            if (request.ClaseId <= 0)
            {
                throw new LogicaNegocioException(
                    "La clase es obligatoria");
            }

            if (request.FechaOcurrencia == default)
            {
                throw new LogicaNegocioException(
                    "La fecha de ocurrencia es obligatoria");
            }

            var alumno =
                _repoAlumno.ObtenerPorId(
                    request.AlumnoId);

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

            DateTime fechaOcurrencia =
                request.FechaOcurrencia.Date;

            DateTime fechaActualUruguay =
                HorarioUruguayHelper
                    .ObtenerAhora()
                    .Date;

            ValidarFechaOcurrencia(
                clase,
                fechaOcurrencia,
                fechaActualUruguay);

            bool yaExiste =
                _repoAsistencia.ExisteAsistencia(
                    request.AlumnoId,
                    request.ClaseId,
                    fechaOcurrencia);

            if (yaExiste)
            {
                throw new LogicaNegocioException(
                    "La asistencia ya fue registrada para esta ocurrencia");
            }

            int mesOcurrencia =
                fechaOcurrencia.Month;

            int anioOcurrencia =
                fechaOcurrencia.Year;

            var asistencia =
                new AsistenciaEntidad
                {
                    AlumnoId =
                        request.AlumnoId,

                    ClaseId =
                        request.ClaseId,

                    Presente =
                        request.Presente,

                    Fecha =
                        fechaOcurrencia,

                    FechaRegistro =
                        DateTime.UtcNow,

                    RegistradoPorId =
                        usuarioId,

                    RegistradaPorGeolocalizacion =
                        false,

                    Latitud =
                        null,

                    Longitud =
                        null,

                    DistanciaMetros =
                        null
                };

            _repoAsistencia.Agregar(
                asistencia);

            ActualizarRachaYBloqueo(
                alumno,
                request.Presente,
                mesOcurrencia,
                anioOcurrencia);
        }

        private void ActualizarRachaYBloqueo(
            Joki.LogicaNegocio.Entidades.Alumno alumno,
            bool presente,
            int mesOcurrencia,
            int anioOcurrencia)
        {
            if (alumno.MesRachaAsistencia != mesOcurrencia ||
                alumno.AnioRachaAsistencia != anioOcurrencia)
            {
                alumno.RachaAsistenciaMensual =
                    0;

                alumno.DescuentoRachaGenerado =
                    false;

                alumno.MesRachaAsistencia =
                    mesOcurrencia;

                alumno.AnioRachaAsistencia =
                    anioOcurrencia;
            }

            if (presente)
            {
                alumno.RachaAsistenciaMensual++;

                alumno.BloqueadoPorInasistencias =
                    false;

                AplicarDescuentoPorRacha(
                    alumno,
                    mesOcurrencia,
                    anioOcurrencia);

                _repoAlumno.Modificar(
                    alumno);

                return;
            }

            alumno.RachaAsistenciaMensual =
                0;

            var ultimasAsistencias =
                _repoAsistencia
                    .ObtenerUltimasAsistencias(
                        alumno.UsuarioId,
                        5);

            bool todasSonFaltas =
                ultimasAsistencias.Count == 5 &&
                ultimasAsistencias.All(
                    asistencia =>
                        !asistencia.Presente);

            if (todasSonFaltas)
            {
                alumno.BloqueadoPorInasistencias =
                    true;
            }

            _repoAlumno.Modificar(
                alumno);
        }

        private void AplicarDescuentoPorRacha(
            Joki.LogicaNegocio.Entidades.Alumno alumno,
            int mesOcurrencia,
            int anioOcurrencia)
        {
            if (alumno.RachaAsistenciaMensual < 10 ||
                alumno.DescuentoRachaGenerado)
            {
                return;
            }

            alumno.DescuentoRachaGenerado =
                true;

            decimal montoBase =
                1390m;

            decimal descuento =
                montoBase * 0.10m;

            decimal montoFinal =
                montoBase - descuento;

            var cuota =
                _repoCuota.ObtenerPorAlumnoMesYAnio(
                    alumno.UsuarioId,
                    mesOcurrencia,
                    anioOcurrencia);

            if (cuota == null)
            {
                return;
            }

            cuota.Descuento =
                descuento;

            cuota.MontoFinal =
                montoFinal;

            _repoCuota.Modificar(
                cuota);
        }

        private static void ValidarFechaOcurrencia(
            Joki.LogicaNegocio.Entidades.Clase clase,
            DateTime fechaOcurrencia,
            DateTime fechaActualUruguay)
        {
            if (fechaOcurrencia.Date >
                fechaActualUruguay.Date)
            {
                throw new LogicaNegocioException(
                    "No se puede registrar asistencia para una ocurrencia futura");
            }

            if (fechaOcurrencia.Date <
                clase.FechaInicio.Date)
            {
                throw new LogicaNegocioException(
                    "La fecha indicada es anterior al inicio de la clase");
            }

            if (clase.FechaFin.HasValue &&
                fechaOcurrencia.Date >
                clase.FechaFin.Value.Date)
            {
                throw new LogicaNegocioException(
                    "La fecha indicada es posterior al final de la clase");
            }

            DayOfWeek diaEsperado =
                ConvertirDiaSemana(
                    clase.DiaSemana);

            if (fechaOcurrencia.DayOfWeek !=
                diaEsperado)
            {
                throw new LogicaNegocioException(
                    $"La fecha indicada no corresponde al día {clase.DiaSemana} de la clase");
            }

            if (clase.Estado ==
                EstadoClase.Cancelada)
            {
                throw new LogicaNegocioException(
                    "No se puede registrar asistencia en una clase cancelada");
            }
        }

        private static DayOfWeek ConvertirDiaSemana(
            DiaSemana diaSemana)
        {
            return diaSemana switch
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

                _ =>
                    throw new LogicaNegocioException(
                        "El día configurado para la clase no es válido")
            };
        }
    }
}