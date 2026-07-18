namespace Joki.LogicaNegocio.ValueObjects
{
    public class AlumnoGrupoVO
    {
        public int Id { get; set; }

        public string Nombre { get; set; } = string.Empty;

        public string Apellido { get; set; } = string.Empty;

        public bool BloqueadoPorInasistencias { get; set; }

        public bool BloqueadoPorDeuda { get; set; }

        public int AsistenciasPresentes { get; set; }

        public int TotalClasesEvaluadas { get; set; }

        public decimal PorcentajeAsistencia { get; set; }

        public DateTime? UltimaAsistencia { get; set; }

        public int RachaActual { get; set; }

        public int InasistenciasConsecutivas { get; set; }
    }
}