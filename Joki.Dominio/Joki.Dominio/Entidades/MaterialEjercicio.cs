namespace Joki.LogicaNegocio.Entidades
{
    public class MaterialEjercicio
    {
        public int Id { get; set; }
        public int ClaseId { get; set; }
        public string Titulo { get; set; }
        public string Url { get; set; }
        public string Descripcion { get; set; }

        public virtual Clase Clase { get; set; }

        public MaterialEjercicio()
        {
            Titulo = string.Empty;
            Url = string.Empty;
            Descripcion = string.Empty;
        }
    }
}
