using Joki.LogicaNegocio.Entidades;
using Joki.LogicaNegocio.InterfacesRepositorio;
using Microsoft.EntityFrameworkCore;

namespace Joki.Infraestructura.AccesoDatos.EF.Repositorios
{
    public class RepositorioUsuario : IRepositorioUsuario
    {
        private readonly JokiContext _contexto;

        public RepositorioUsuario(JokiContext contexto)
        {
            _contexto = contexto;
        }

        public bool ExisteEmail(string email)
        {
            return _contexto.Set<Usuario>().Any(u => u.Email.Valor == email);
        }

        public Usuario? ObtenerPorEmail(string email)
        {
            return _contexto.Set<Usuario>()
                .Include(u => u.Rol)
                .FirstOrDefault(u => u.Email.Valor == email);
        }
    }
}
