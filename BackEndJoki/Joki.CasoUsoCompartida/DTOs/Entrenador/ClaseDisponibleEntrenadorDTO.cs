namespace Joki.CasoUsoCompartida.DTOs.Entrenador
{
    public class ClaseDisponibleEntrenadorDTO
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

        public int CupoMaximo { get; set; }

        public int CantidadAlumnos { get; set; }

        public int CantidadEntrenadores { get; set; }

        public bool TieneConflictoHorario { get; set; }

        public decimal Latitud { get; set; }

        public decimal Longitud { get; set; }

        public string CodigoPostal { get; set; } =
            string.Empty;

        public decimal RadioGeolocalizacion { get; set; }
    }
}