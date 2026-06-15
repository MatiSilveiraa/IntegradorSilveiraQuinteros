using Joki.LogicaNegocio.Entidades;
using Joki.LogicaNegocio.InterfacesRepositorio;

namespace Joki.Infraestructura.AccesoDatos.EF.Repositorios
{
    public class RepositorioRecuperacionContrasena :
        IRepositorioRecuperacionContrasena
    {
        private readonly JokiContext _context;

        public RepositorioRecuperacionContrasena(
            JokiContext context)
        {
            _context = context;
        }

        public void Agregar(
            RecuperacionContrasena recuperacion)
        {
            _context.RecuperacionesContrasena.Add(recuperacion);

            _context.SaveChanges();
        }

        public RecuperacionContrasena? ObtenerUltimaPorUsuario(
    int usuarioId)
        {
            return _context.RecuperacionesContrasena
                .Where(r => r.UsuarioId == usuarioId)
                .OrderByDescending(r => r.FechaCreacion)
                .FirstOrDefault();
        }

        public RecuperacionContrasena? ObtenerActivaPorUsuarioYCodigo(
            int usuarioId,
            string codigo)
        {
            return _context.RecuperacionesContrasena
                .FirstOrDefault(r =>
                    r.UsuarioId == usuarioId &&
                    r.Codigo == codigo &&
                    !r.Usado &&
                    r.FechaExpiracion >= DateTime.UtcNow);
        }

        public void Modificar(
            RecuperacionContrasena recuperacion)
        {
            _context.RecuperacionesContrasena.Update(recuperacion);

            _context.SaveChanges();
        }
    }
}
