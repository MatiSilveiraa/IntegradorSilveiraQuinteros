using Joki.LogicaNegocio.Entidades;
using Joki.LogicaNegocio.InterfacesRepositorio;

namespace Joki.Infraestructura.AccesoDatos.EF.Repositorios
{
    public class RepositorioCodigoLoginSinPassword :
        IRepositorioCodigoLoginSinPassword
    {
        private readonly JokiContext _context;

        public RepositorioCodigoLoginSinPassword(
            JokiContext context)
        {
            _context = context;
        }

        public void Agregar(
            CodigoLoginSinPassword codigo)
        {
            _context.CodigosLoginSinPassword.Add(codigo);

            _context.SaveChanges();
        }

        public CodigoLoginSinPassword? ObtenerActivoPorUsuarioYCodigo(
            int usuarioId,
            string codigo)
        {
            return _context.CodigosLoginSinPassword
                .FirstOrDefault(c =>
                    c.UsuarioId == usuarioId &&
                    c.Codigo == codigo &&
                    !c.Usado &&
                    c.FechaExpiracion >= DateTime.UtcNow);
        }

        public CodigoLoginSinPassword? ObtenerUltimoPendientePorUsuario(
            int usuarioId)
        {
            return _context.CodigosLoginSinPassword
                .Where(c =>
                    c.UsuarioId == usuarioId &&
                    !c.Usado)
                .OrderByDescending(c => c.FechaCreacion)
                .FirstOrDefault();
        }

        public void Modificar(
            CodigoLoginSinPassword codigo)
        {
            _context.CodigosLoginSinPassword.Update(codigo);

            _context.SaveChanges();
        }
    }
}