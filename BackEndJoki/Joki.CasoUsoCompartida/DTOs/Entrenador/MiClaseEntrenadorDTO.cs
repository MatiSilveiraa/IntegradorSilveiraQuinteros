namespace Joki.CasoUsoCompartida.DTOs.Entrenador
{
    public class MiClaseEntrenadorDTO
    {
        public int ClaseId { get; set; }

        public int GrupoId { get; set; }

        public string Grupo { get; set; } =
            string.Empty;

        public string DiaSemana { get; set; } =
            string.Empty;

        public TimeSpan HoraInicio { get; set; }

        public TimeSpan HoraFin { get; set; }

        public DateTime FechaInicio { get; set; }

        public DateTime? FechaFin { get; set; }

        public string Estado { get; set; } =
            string.Empty;

        public bool EsPrincipal { get; set; }

        public int CantidadEntrenadores { get; set; }

        public int CantidadAlumnos { get; set; }

        public int CupoMaximo { get; set; }
    }
}