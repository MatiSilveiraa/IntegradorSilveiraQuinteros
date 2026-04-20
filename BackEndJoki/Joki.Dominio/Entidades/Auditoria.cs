namespace Joki.LogicaNegocio.Entidades
{
    public class Auditoria
    {
        public int Id { get; set; }

        public int UsuarioId { get; set; }
        public virtual Usuario Usuario { get; set; } = null!;

        public string Entidad { get; set; }
        public int EntidadId { get; set; }
        public string Accion { get; set; }

        public DateTime Fecha { get; set; }

        public Auditoria()
        {
            Entidad = string.Empty;
            Accion = string.Empty;
            Fecha = DateTime.UtcNow;
        }
    }
}