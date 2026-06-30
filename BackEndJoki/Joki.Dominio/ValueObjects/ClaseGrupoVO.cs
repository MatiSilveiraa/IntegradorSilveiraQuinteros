namespace Joki.LogicaNegocio.ValueObjects
{
    public class ClaseGrupoVO
    {
        public int Id { get; set; }

        public string DiaSemana { get; set; } = string.Empty;

        public TimeSpan HoraInicio { get; set; }

        public TimeSpan HoraFin { get; set; }

        public int CupoMaximo { get; set; }

        public int Inscriptos { get; set; }

        public bool Activa { get; set; }
    }
}