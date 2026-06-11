using Joki.LogicaNegocio.Enums;

namespace Joki.LogicaNegocio.Entidades
{
    public class Notificacion
    {
        public int Id { get; set; }

        public int UsuarioId { get; set; }
        public virtual Usuario Usuario { get; set; } = null!;

        public string Titulo { get; set; }

        public string Mensaje { get; set; }

        public TipoNotificacion Tipo { get; set; }

        public bool Leida { get; set; }

        public DateTime FechaCreacion { get; set; }

        public DateTime? FechaLectura { get; set; }

        public string? UrlDestino { get; set; }

        public string? EntidadReferencia { get; set; }

        public int? EntidadReferenciaId { get; set; }

        public Notificacion()
        {
            Titulo = string.Empty;
            Mensaje = string.Empty;
            Tipo = TipoNotificacion.General;
            Leida = false;
            FechaCreacion = DateTime.UtcNow;
        }
    }
}