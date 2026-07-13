using Joki.LogicaNegocio.Enums;

namespace Joki.CasoUsoCompartida.DTOs.Clase
{
    public class EditarClaseRequest
    {
        public int GrupoId { get; set; }

        public DiaSemana DiaSemana { get; set; }

        public TimeSpan HoraInicio { get; set; }

        public TimeSpan HoraFin { get; set; }

        public decimal Latitud { get; set; }

        public decimal Longitud { get; set; }

        public string CodigoPostal { get; set; } = string.Empty;

        public decimal RadioGeolocalizacion { get; set; }

        public bool EsFija { get; set; }

        public DateTime FechaInicio { get; set; }

        public DateTime? FechaFin { get; set; }

        public int CupoMaximo { get; set; }

        public List<int> EntrenadoresIds { get; set; } = new();

        public int? EntrenadorPrincipalId { get; set; }

        public bool ForzarAsignacion { get; set; }
    }
}