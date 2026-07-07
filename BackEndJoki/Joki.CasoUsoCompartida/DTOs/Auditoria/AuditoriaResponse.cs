namespace Joki.CasoUsoCompartida.DTOs.Auditoria
{
    public class AuditoriaResponse
    {
        public int Id { get; set; }

        public int UsuarioId { get; set; }

        public string? UsuarioNombre { get; set; }

        public string? UsuarioEmail { get; set; }

        public string Entidad { get; set; } = string.Empty;

        public int EntidadId { get; set; }

        public string? EntidadNombre { get; set; }

        public string Accion { get; set; } = string.Empty;

        public DateTime Fecha { get; set; }
    }
}