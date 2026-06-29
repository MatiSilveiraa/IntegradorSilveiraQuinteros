namespace Joki.LogicaNegocio.ValueObjects
{
    public class AlumnoAgendaVO
    {
        public int Id { get; set; }

        public string Nombre { get; set; } = new Nombre().Valor;

        public string Apellido { get; set; } = new Apellido().Valor;
    }
}