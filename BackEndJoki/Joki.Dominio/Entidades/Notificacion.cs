using Joki.LogicaNegocio.Enums;

namespace Joki.LogicaNegocio.Entidades
{
    public class Notificacion
    {
        public int Id { get; set; }

        public int UsuarioId { get; set; }
        public virtual Usuario Usuario { get; set; } = null!;

        public DateTime FechaCreacion { get; set; }
        public DateTime? FechaLectura { get; set; }

        public string Mensaje { get; set; }
        public TipoNotificacion Tipo { get; set; }

        public bool Leida { get; set; }

        public Notificacion()
        {
            Mensaje = string.Empty;
            Tipo = TipoNotificacion.General;
            Leida = false;
            FechaCreacion = DateTime.UtcNow;
        }
    }
}