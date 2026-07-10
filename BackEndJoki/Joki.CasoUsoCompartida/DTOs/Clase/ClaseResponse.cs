namespace Joki.CasoUsoCompartida.DTOs.Clase
{
    public class ClaseResponse
    {
        public int Id { get; set; }

        public int GrupoId { get; set; }
        public string? GrupoNombre { get; set; }

        public string? UbicacionNombre { get; set; }

        public string? EntrenadorNombre { get; set; }
        public string DiaSemana { get; set; }

        public TimeSpan HoraInicio { get; set; }

        public TimeSpan HoraFin { get; set; }

        public decimal Latitud { get; set; }

        public decimal Longitud { get; set; }

        public string CodigoPostal { get; set; }

        public decimal RadioGeolocalizacion { get; set; }

        public bool EsFija { get; set; }

        public DateTime FechaInicio { get; set; }

        public DateTime? FechaFin { get; set; }

        public int CupoMaximo { get; set; }

        public string Estado { get; set; }

        public int CantidadInscriptos { get; set; }

        public ClaseResponse()
        {
            DiaSemana = string.Empty;

            CodigoPostal = string.Empty;

            Estado = string.Empty;
        }
    }
}