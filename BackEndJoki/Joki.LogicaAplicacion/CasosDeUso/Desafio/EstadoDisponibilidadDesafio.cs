namespace Joki.LogicaAplicacion.CasosDeUso.Desafio
{
    public class EstadoDisponibilidadDesafio
    {
        public string Estado { get; set; } = string.Empty;

        public bool PuedeParticipar { get; set; }

        public bool YaParticipa { get; set; }

        public string? MotivoEstado { get; set; }
    }
}