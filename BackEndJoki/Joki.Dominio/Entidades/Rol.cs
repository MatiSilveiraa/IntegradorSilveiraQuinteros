
namespace Joki.LogicaNegocio.Entidades
{
    public class Rol
    {
        public int Id { get; set; }
        public string Nombre { get; set; } = string.Empty;
        public ICollection<Usuario> Usuarios { get; set; } = new List<Usuario>();

        public Rol() { } 

        public Rol(int id, string nombre)
        {
            Id = id;
            Nombre = nombre;
        }
    }
}
