namespace Joki.CasoUsoCompartida.DTOs.Grupo
{
    public class CrearGrupoRequest
    {
        public string Nombre { get; set; }

        public string Nivel { get; set; }

        public CrearGrupoRequest()
        {
            Nombre = string.Empty;
            Nivel = string.Empty;
        }
    }
}