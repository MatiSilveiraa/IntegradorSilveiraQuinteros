
namespace Joki.CasoUsoCompartida.DTOs.Perfil
{
    public class PerfilResponse
    {
        public int Id { get; set; }
        public string Nombre { get; set; } = string.Empty;
        public string Apellido { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string? Celular { get; set; }
        public string? SociedadMedica { get; set; }
        public DateTime? FechaNacimiento { get; set; }
        public int Genero { get; set; }

        public bool BloqueadoPorInasistencias { get; set; }
        public int RachaAsistenciaMensual { get; set; }
        public bool DescuentoRachaGenerado { get; set; }
    }
}
