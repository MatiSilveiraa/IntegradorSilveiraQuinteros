namespace Joki.CasoUsoCompartida.DTOs.Entrenador
{
    public class ClaseDetalleDTO
    {
        public int Id { get; set; }

        public int GrupoId { get; set; }

        public string Grupo { get; set; } = "";

        public string DiaSemana { get; set; } = "";

        public TimeSpan HoraInicio { get; set; }

        public TimeSpan HoraFin { get; set; }

        public int CupoMaximo { get; set; }

        public int Inscriptos { get; set; }

        public int CuposDisponibles { get; set; }

        public decimal Latitud { get; set; }

        public decimal Longitud { get; set; }

        public string CodigoPostal { get; set; } = "";

        public decimal Radio { get; set; }

        public List<AlumnoClaseDTO> Alumnos { get; set; } = new();
    }
}