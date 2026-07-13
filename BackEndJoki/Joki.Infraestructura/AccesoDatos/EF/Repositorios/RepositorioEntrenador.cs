using Joki.LogicaNegocio.Entidades;
using Joki.LogicaNegocio.Enums;
using Joki.LogicaNegocio.InterfacesRepositorio;
using Microsoft.EntityFrameworkCore;

namespace Joki.Infraestructura.AccesoDatos.EF.Repositorios
{
    public class RepositorioEntrenador : IRepositorioEntrenador
    {
        private readonly JokiContext _context;

        public RepositorioEntrenador(JokiContext context)
        {
            _context = context;
        }

        public IEnumerable<Entrenador> ObtenerActivos()
        {
            return _context.Entrenadores
                .AsNoTracking()
                .Where(e => e.Estado == EstadoUsuario.ACTIVO)
                .OrderBy(e => e.Nombre.Valor)
                .ThenBy(e => e.Apellido.Valor)
                .ToList();
        }
    }
}