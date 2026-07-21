namespace Joki.CasoUsoCompartida.DTOs.Clase
{
    public class AlumnoListaEsperaResponse
    {
        public int ListaEsperaId { get; set; }

        public int AlumnoId { get; set; }

        public string Nombre { get; set; }
            = string.Empty;

        public string Apellido { get; set; }
            = string.Empty;

        public string Email { get; set; }
            = string.Empty;

        public string? Celular { get; set; }

        public string EstadoAlumno { get; set; }
            = string.Empty;

        public DateTime FechaSolicitud { get; set; }

        public int Posicion { get; set; }
    }
}