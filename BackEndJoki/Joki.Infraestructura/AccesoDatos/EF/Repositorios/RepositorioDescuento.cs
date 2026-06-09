using Joki.LogicaNegocio.Entidades;
using Joki.LogicaNegocio.InterfacesRepositorio;

namespace Joki.Infraestructura.AccesoDatos.EF.Repositorios
{
    public class RepositorioDescuento :
        IRepositorioDescuento
    {
        private readonly JokiContext _context;

        public RepositorioDescuento(
            JokiContext context)
        {
            _context = context;
        }

        public void Agregar(Descuento descuento)
        {
            _context.Descuentos.Add(descuento);

            _context.SaveChanges();
        }

        public void Modificar(Descuento descuento)
        {
            _context.Descuentos.Update(descuento);

            _context.SaveChanges();
        }

        public Descuento? ObtenerPorId(int id)
        {
            return _context.Descuentos
                .FirstOrDefault(d => d.Id == id);
        }

        public IEnumerable<Descuento> ObtenerTodos()
        {
            return _context.Descuentos
                .OrderBy(d => d.Nombre)
                .ToList();
        }

        public IEnumerable<Descuento> ObtenerActivos()
        {
            return _context.Descuentos
                .Where(d => d.Activo)
                .OrderBy(d => d.Nombre)
                .ToList();
        }
    }
}
