using Joki.LogicaNegocio.Entidades;
using Joki.LogicaNegocio.InterfacesRepositorio;

namespace Joki.Infraestructura.AccesoDatos.EF.Repositorios
{
    public class RepositorioConfiguracionCuota :
        IRepositorioConfiguracionCuota
    {
        private readonly JokiContext _context;

        public RepositorioConfiguracionCuota(
            JokiContext context)
        {
            _context = context;
        }

        public ConfiguracionCuota? ObtenerActiva()
        {
            return _context.ConfiguracionesCuota
                .FirstOrDefault(c => c.Activa);
        }

        public void Agregar(
            ConfiguracionCuota configuracion)
        {
            _context.ConfiguracionesCuota.Add(configuracion);

            _context.SaveChanges();
        }

        public void Modificar(
            ConfiguracionCuota configuracion)
        {
            _context.ConfiguracionesCuota.Update(configuracion);

            _context.SaveChanges();
        }
    }
}