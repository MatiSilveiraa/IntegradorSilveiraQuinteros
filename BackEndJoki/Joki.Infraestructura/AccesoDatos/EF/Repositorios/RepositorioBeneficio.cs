using Joki.LogicaNegocio.Entidades;
using Joki.LogicaNegocio.Enums;
using Joki.LogicaNegocio.InterfacesRepositorio;
using Microsoft.EntityFrameworkCore;

namespace Joki.Infraestructura.AccesoDatos.EF.Repositorios
{
    public class RepositorioBeneficio :
        IRepositorioBeneficio
    {
        private readonly JokiContext _context;

        public RepositorioBeneficio(
            JokiContext context)
        {
            _context = context;
        }

        public void Agregar(Beneficio beneficio)
        {
            _context.Beneficios.Add(beneficio);

            _context.SaveChanges();
        }

        public void Modificar(Beneficio beneficio)
        {
            _context.Beneficios.Update(beneficio);

            _context.SaveChanges();
        }

        public IEnumerable<Beneficio> ObtenerPendientesPorAlumno(
    int alumnoId)
        {
            return _context.Beneficios
                .Include(b => b.Descuento)
                .Where(b =>
                    b.AlumnoId == alumnoId &&
                    b.Estado == EstadoBeneficio.PENDIENTE &&
                    (
                        (b.Descuento != null &&
                         b.Descuento.Activo)
                        ||
                        b.CuotaGratis
                    ) &&
                    b.MesesAplicados < b.MesesDuracion)
                .ToList();
        }

        public IEnumerable<Beneficio> ObtenerPorAlumno(
            int alumnoId)
        {
            return _context.Beneficios
                .Include(b => b.Descuento)
                .Where(b => b.AlumnoId == alumnoId)
                .ToList();
        }

        public IEnumerable<Beneficio> ObtenerPendientesPorDescuento(
             int descuentoId)
        {
            return _context.Beneficios
                .Where(b =>
                    b.DescuentoId == descuentoId &&
                    b.Estado == EstadoBeneficio.PENDIENTE)
                .ToList();
        }
    }
}