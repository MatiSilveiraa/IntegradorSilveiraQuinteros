namespace Joki.CasoUsoCompartida.DTOs.Grupo
{
    public class CrearGrupoRequest
    {
        public string Nombre { get; set; }
        public string Nivel { get; set; }
        public int CupoMaximo { get; set; }
        public string DiaSemana { get; set; }
        public TimeSpan HoraInicio { get; set; }
        public TimeSpan HoraFin { get; set; }
        public decimal Latitud { get; set; }
        public decimal Longitud { get; set; }
        public string CodigoPostal { get; set; }
        public decimal RadioGeolocalizacion { get; set; }
        public bool EsFijo { get; set; }
        public DateTime FechaInicio { get; set; }
        public DateTime? FechaFin { get; set; }
        public int EntrenadorId { get; set; }
    }
}
