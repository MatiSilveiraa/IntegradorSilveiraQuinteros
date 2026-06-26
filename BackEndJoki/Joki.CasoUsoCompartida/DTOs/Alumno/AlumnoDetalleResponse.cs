namespace Joki.CasoUsoCompartida.DTOs.Alumno
{
    public class AlumnoDetalleResponse
    {
        public int Id { get; set; }

        public string Nombre { get; set; } = string.Empty;

        public string Apellido { get; set; } = string.Empty;

        public string Email { get; set; } = string.Empty;

        public string? Celular { get; set; }

        public string? SociedadMedica { get; set; }

        public DateTime? FechaNacimiento { get; set; }

        public int Genero { get; set; }

        public decimal? Peso { get; set; }

        public decimal? Estatura { get; set; }

        public decimal? IMC { get; set; }

        public bool BloqueadoPorInasistencias { get; set; }

        public bool BloqueadoPorDeuda { get; set; }

        public int RachaAsistenciaMensual { get; set; }

        public bool TwoFactorEnabled { get; set; }

        public string Estado { get; set; } = string.Empty;

        public int CantidadClasesInscripto { get; set; }

        public int CuotasPendientes { get; set; }
    }
}