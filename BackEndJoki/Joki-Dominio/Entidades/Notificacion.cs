namespace Joki.LogicaNegocio.Entidades
{
    public class Notificacion
    {
        public int Id { get; set; }
        public int UsuarioId { get; set; }
        public DateTime FechaCreacion { get; set; }
        public DateTime? FechaLectura { get; set; }
        public string Mensaje { get; set; }
        public string Tipo { get; set; }
        public bool Leida { get; set; }

        public virtual Usuario Usuario { get; set; }

        public Notificacion()
        {
            Mensaje = string.Empty;
            Tipo = string.Empty;
            Leida = false;
        }
    }
}
