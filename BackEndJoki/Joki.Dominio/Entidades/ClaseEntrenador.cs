namespace Joki.LogicaNegocio.Entidades
{
    public class ClaseEntrenador
    {
        public int Id { get; set; }

        public int ClaseId { get; set; }

        public virtual Clase Clase { get; set; } = null!;

        public int EntrenadorId { get; set; }

        public virtual Entrenador Entrenador { get; set; } = null!;

        public bool EsPrincipal { get; set; }

        public DateTime FechaAsignacion { get; set; }

        public ClaseEntrenador()
        {
            FechaAsignacion = DateTime.UtcNow;
            EsPrincipal = false;
        }
    }
}