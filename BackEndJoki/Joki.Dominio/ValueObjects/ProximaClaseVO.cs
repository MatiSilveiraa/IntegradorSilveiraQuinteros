namespace Joki.LogicaNegocio.ValueObjects
{
    public class ProximaClaseVO
    {
        public int ClaseId { get; set; }

        public string Grupo { get; set; } = string.Empty;

        public TimeSpan HoraInicio { get; set; }

        public TimeSpan HoraFin { get; set; }

        public int CantidadAlumnos { get; set; }
    }
}