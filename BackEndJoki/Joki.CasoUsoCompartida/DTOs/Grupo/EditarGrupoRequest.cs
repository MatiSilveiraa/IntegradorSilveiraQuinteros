namespace Joki.CasoUsoCompartida.DTOs.Grupo
{
    public class EditarGrupoRequest
    {
        public string Nombre { get; set; }

        public string Nivel { get; set; }

        public EditarGrupoRequest()
        {
            Nombre = string.Empty;
            Nivel = string.Empty;
        }
    }
}