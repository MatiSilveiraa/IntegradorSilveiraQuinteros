using Joki.LogicaNegocio.Entidades;
using Joki.LogicaNegocio.InterfacesRepositorio;

namespace Joki.Infraestructura.AccesoDatos.EF.Repositorios
{
    public class RepositorioTokenRevocado : IRepositorioTokenRevocado
    {
        private readonly JokiContext _context;

        public RepositorioTokenRevocado(JokiContext context)
        {
            _context = context;
        }

        public void Agregar(TokenRevocado token)
        {
            _context.TokensRevocados.Add(token);
            _context.SaveChanges();
        }

        public bool Existe(string token)
        {
            return _context.TokensRevocados.Any(t => t.Token == token);
        }
    }
}
