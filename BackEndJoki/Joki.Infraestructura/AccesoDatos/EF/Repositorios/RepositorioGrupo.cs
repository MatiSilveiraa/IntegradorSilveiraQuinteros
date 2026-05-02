using Joki.LogicaNegocio.Entidades;
using Joki.LogicaNegocio.InterfacesRepositorio;
using Microsoft.EntityFrameworkCore;

namespace Joki.Infraestructura.AccesoDatos.EF.Repositorios
{
    public class RepositorioGrupo : IRepositorioGrupo
    {
        private readonly JokiContext _context;

        public RepositorioGrupo(JokiContext context)
        {
            _context = context;
        }

        public Grupo Agregar(Grupo grupo)
        {
            _context.Grupos.Add(grupo);
            _context.SaveChanges();
            return grupo;
        }

        public List<Grupo> ObtenerTodos()
        {
            return _context.Grupos.ToList();
        }

        public Grupo? ObtenerPorId(int id)
        {
            return _context.Grupos.FirstOrDefault(g => g.Id == id);
        }

        public void Actualizar(Grupo grupo)
        {
            _context.Grupos.Update(grupo);
            _context.SaveChanges();
        }

        public void Eliminar(int id)
        {
            var grupo = ObtenerPorId(id);

            if (grupo != null)
            {
                _context.Grupos.Remove(grupo);
                _context.SaveChanges();
            }
        }
    }
}
