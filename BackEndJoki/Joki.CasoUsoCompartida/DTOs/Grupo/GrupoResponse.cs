using Joki.CasoUsoCompartida.DTOs.Clase;

namespace Joki.CasoUsoCompartida.DTOs.Grupo
{
    public class GrupoResponse
    {
        public int Id { get; set; }

        public string Nombre { get; set; }

        public string Nivel { get; set; }


        public string Estado { get; set; }

        public int EntrenadorId { get; set; }

        public List<ClaseResponse> Clases { get; set; }

        public GrupoResponse()
        {
            Nombre = string.Empty;

            Nivel = string.Empty;

            Estado = string.Empty;

            Clases = new List<ClaseResponse>();
        }
    }
}