using Joki.LogicaNegocio.Enums;

namespace Joki.LogicaNegocio.Entidades
{
    public class Pago
    {
        public int Id { get; set; }
        public int CuotaId { get; set; }
        public MedioPago MedioPago { get; set; }
        public DateTime FechaPago { get; set; }
        public float Monto { get; set; }

        public virtual Cuota Cuota { get; set; }

        public Pago()
        {
            MedioPago = MedioPago.EFECTIVO;
        }
    }
}
