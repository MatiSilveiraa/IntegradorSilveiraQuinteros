
namespace Joki.CasoUsoCompartida.DTOs.Perfil
{
    public class ActualizarPerfilRequest
    {
        public string Nombre { get; set; } = string.Empty;
        public string Apellido { get; set; } = string.Empty;
        public string? Celular { get; set; }
        public string? SociedadMedica { get; set; }
        public DateTime? FechaNacimiento { get; set; }
        public int Genero { get; set; } 
    }
}
