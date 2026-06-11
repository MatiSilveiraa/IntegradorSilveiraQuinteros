namespace Joki.CasoUsoCompartida.DTOs.Notificacion
{
    public class NotificacionResponse
    {
        public int Id { get; set; }

        public string Titulo { get; set; } = string.Empty;

        public string Mensaje { get; set; } = string.Empty;

        public string Tipo { get; set; } = string.Empty;

        public bool Leida { get; set; }

        public DateTime FechaCreacion { get; set; }

        public DateTime? FechaLectura { get; set; }

        public string? UrlDestino { get; set; }

        public string? EntidadReferencia { get; set; }

        public int? EntidadReferenciaId { get; set; }
    }
}