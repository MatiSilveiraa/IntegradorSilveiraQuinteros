namespace Joki.CasoUsoCompartida.DTOs.Desafio
{
    public class AsignarGanadoresRequest
    {
        public int DesafioId { get; set; }

        public List<int> AlumnosIds { get; set; }

        public AsignarGanadoresRequest()
        {
            AlumnosIds = new List<int>();
        }
    }
}