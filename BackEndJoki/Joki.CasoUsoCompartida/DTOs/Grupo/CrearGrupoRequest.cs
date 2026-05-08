using Joki.CasoUsoCompartida.DTOs.Clase;

namespace Joki.CasoUsoCompartida.DTOs.Grupo
{
    public class CrearGrupoRequest
    {
        public string Nombre { get; set; }

        public string Nivel { get; set; }

        public int EntrenadorId { get; set; }

        public int CupoMaximo { get; set; }

        public List<CrearClaseRequest> Clases { get; set; }

        public CrearGrupoRequest()
        {
            Nombre = string.Empty;

            Nivel = string.Empty;

            Clases = new List<CrearClaseRequest>();
        }
    }
}