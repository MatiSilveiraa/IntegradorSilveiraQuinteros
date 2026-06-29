using Joki.LogicaNegocio.ValueObjects;

namespace Joki.CasoUsoCompartida.DTOs.Entrenador
{
    public class AlumnoAgendaDTO
    {
        public int Id { get; set; }

        public string Nombre { get; set; } = new Nombre().Valor;
        public string Apellido { get; set; } = new Apellido().Valor;

 
    }
}