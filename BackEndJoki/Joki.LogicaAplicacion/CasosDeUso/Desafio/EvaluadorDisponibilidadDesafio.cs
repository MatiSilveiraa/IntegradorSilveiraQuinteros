using DesafioEntidad =
    Joki.LogicaNegocio.Entidades.Desafio;

namespace Joki.LogicaAplicacion.CasosDeUso.Desafio
{
    public static class EvaluadorDisponibilidadDesafio
    {
        public static EstadoDisponibilidadDesafio Evaluar(
            DesafioEntidad desafio,
            bool yaParticipa,
            bool esAlumno)
        {
            DateTime fechaActual =
                ObtenerFechaActualUruguay();

            if (!desafio.Activo)
            {
                return new EstadoDisponibilidadDesafio
                {
                    Estado = "CANCELADO",
                    PuedeParticipar = false,
                    YaParticipa = yaParticipa,
                    MotivoEstado =
                        "El desafío no se encuentra disponible"
                };
            }

            if (fechaActual < desafio.FechaInicio.Date)
            {
                return new EstadoDisponibilidadDesafio
                {
                    Estado = "PROXIMO",
                    PuedeParticipar = false,
                    YaParticipa = yaParticipa,
                    MotivoEstado =
                        $"El desafío comienza el {desafio.FechaInicio:dd/MM/yyyy}"
                };
            }

            if (fechaActual > desafio.FechaFin.Date)
            {
                return new EstadoDisponibilidadDesafio
                {
                    Estado = "FINALIZADO",
                    PuedeParticipar = false,
                    YaParticipa = yaParticipa,
                    MotivoEstado =
                        "El desafío ya finalizó"
                };
            }

            if (!esAlumno)
            {
                return new EstadoDisponibilidadDesafio
                {
                    Estado = "ACTIVO",
                    PuedeParticipar = false,
                    YaParticipa = false,
                    MotivoEstado =
                        "Solo los alumnos pueden participar"
                };
            }

            if (yaParticipa)
            {
                return new EstadoDisponibilidadDesafio
                {
                    Estado = "ACTIVO",
                    PuedeParticipar = false,
                    YaParticipa = true,
                    MotivoEstado =
                        "Ya participás en este desafío"
                };
            }

            return new EstadoDisponibilidadDesafio
            {
                Estado = "ACTIVO",
                PuedeParticipar = true,
                YaParticipa = false,
                MotivoEstado = null
            };
        }

        public static DateTime ObtenerFechaActualUruguay()
        {
            TimeZoneInfo zonaUruguay;

            try
            {
                zonaUruguay =
                    TimeZoneInfo.FindSystemTimeZoneById(
                        "Montevideo Standard Time");
            }
            catch (TimeZoneNotFoundException)
            {
                zonaUruguay =
                    TimeZoneInfo.FindSystemTimeZoneById(
                        "America/Montevideo");
            }

            return TimeZoneInfo.ConvertTimeFromUtc(
                    DateTime.UtcNow,
                    zonaUruguay)
                .Date;
        }
    }
}