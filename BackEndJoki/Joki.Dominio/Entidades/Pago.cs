using Joki.LogicaNegocio.Enums;

namespace Joki.LogicaNegocio.Entidades
{
    public class Pago
    {
        public int Id { get; set; }

        public int CuotaId { get; set; }
        public virtual Cuota Cuota { get; set; } = null!;

        public MedioPago MedioPago { get; set; }

        public DateTime FechaPago { get; set; }

        public decimal Monto { get; set; }

        public Pago()
        {
            MedioPago = MedioPago.EFECTIVO;
            FechaPago = DateTime.UtcNow;
        }
    }
}