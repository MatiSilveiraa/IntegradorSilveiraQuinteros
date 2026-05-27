using Joki.Infraestructura.AccesoDatos.EF;
using Joki.LogicaNegocio.Entidades;
using Joki.LogicaNegocio.InterfacesRepositorio;

namespace Joki.Infraestructura.AccesoDatos.Repositorios
{
    public class RepositorioPago : IRepositorioPago
    {
        private readonly JokiContext _contexto;

        public RepositorioPago(JokiContext contexto)
        {
            _contexto = contexto;
        }

        public void Agregar(Pago pago)
        {
            _contexto.Pagos.Add(pago);

            _contexto.SaveChanges();
        }

        public IEnumerable<Pago> ObtenerPorCuota(int cuotaId)
        {
            return _contexto.Pagos
                .Where(p => p.CuotaId == cuotaId)
                .ToList();
        }

        public void Modificar(Pago pago)
        {
            _contexto.Pagos.Update(pago);

            _contexto.SaveChanges();
        }

        public Pago? ObtenerPorReferenciaExterna(string referenciaExterna)
        {
            return _contexto.Pagos
                .FirstOrDefault(p => p.ReferenciaExterna == referenciaExterna);
        }
    }
}