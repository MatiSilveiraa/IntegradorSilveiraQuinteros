using Joki.LogicaNegocio.Enums;

namespace Joki.LogicaNegocio.Entidades
{
    public class Grupo
    {
        public int Id { get; set; }

        public string Nombre { get; set; }

        public string Nivel { get; set; }

        public EstadoGrupo Estado { get; set; }

        public int EntrenadorId { get; set; }

        public virtual Entrenador Entrenador { get; set; } = null!;

        public virtual ICollection<Clase> Clases { get; set; }

        public Grupo()
        {
            Nombre = string.Empty;
            Nivel = string.Empty;

            Estado = EstadoGrupo.ACTIVO;

            Clases = new List<Clase>();
        }
    }
}