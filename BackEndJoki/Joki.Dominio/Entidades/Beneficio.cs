using Joki.LogicaNegocio.Enums;

namespace Joki.LogicaNegocio.Entidades
{
    public class Beneficio
    {
        public int Id { get; set; }

        public int AlumnoId { get; set; }
        public virtual Alumno Alumno { get; set; } = null!;

        public int? RecompensaId { get; set; }
        public virtual Recompensa? Recompensa { get; set; }

        public int? DescuentoId { get; set; }
        public virtual Descuento? Descuento { get; set; }
        public bool CuotaGratis { get; set; }

        public EstadoBeneficio Estado { get; set; }

        public string DescripcionBeneficio { get; set; }

        public int MesesDuracion { get; set; }

        public int MesesAplicados { get; set; }

        public DateTime FechaAsignacion { get; set; }

        public Beneficio()
        {
            Estado = EstadoBeneficio.PENDIENTE;
            DescripcionBeneficio = string.Empty;
            MesesDuracion = 1;
            MesesAplicados = 0;
            FechaAsignacion = DateTime.UtcNow;
            CuotaGratis = false;
        }
    }
}