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

        public EstadoBeneficio Estado { get; set; }

        public string DescripcionBeneficio { get; set; }

        public Beneficio()
        {
            Estado = EstadoBeneficio.PENDIENTE;
            DescripcionBeneficio = string.Empty;
        }
    }
}