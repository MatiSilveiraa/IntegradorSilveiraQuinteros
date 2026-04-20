using Joki.LogicaNegocio.Enums;

namespace Joki.LogicaNegocio.Entidades
{
    public class Cuota
    {
        public int Id { get; set; }
        public int AlumnoId { get; set; }
        public int Mes { get; set; }
        public int Anio { get; set; }
        public float MontoBase { get; set; }
        public float Descuento { get; set; }
        public float MontoFinal { get; set; }
        public EstadoCuota Estado { get; set; }

        public virtual Alumno Alumno { get; set; }
        public virtual ICollection<Pago> Pagos { get; set; }

        public Cuota()
        {
            Estado = EstadoCuota.PENDIENTE;
            Pagos = new List<Pago>();
        }
    }
}
