
namespace Joki.CasoUsoCompartida.DTOs.Alumno
{
    public class RegistrarAlumnoRequest
    {
        public string Nombre { get; set; }
        public string Apellido { get; set; }
        public string Email { get; set; }
        public string Contrasena { get; set; }
        public decimal Peso { get; set; }
        public decimal Estatura { get; set; }
        public string? Celular { get; set; }
        public DateTime? FechaNacimiento { get; set; }
        public int Genero { get; set; }
        public string? SociedadMedica { get; set; }

        public RegistrarAlumnoRequest()
        {
            Nombre = string.Empty;
            Apellido = string.Empty;
            Email = string.Empty;
            Contrasena = string.Empty;
        }
    }
}
