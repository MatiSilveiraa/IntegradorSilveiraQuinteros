namespace Joki.LogicaNegocio.Entidades
{
    public class ParticipacionDesafio
    {
        public int Id { get; set; }
        public int AlumnoId { get; set; }
        public int DesafioId { get; set; }
        public string Resultado { get; set; }
        public bool Ganador { get; set; }

        public virtual Alumno Alumno { get; set; }
        public virtual Desafio Desafio { get; set; }

        public ParticipacionDesafio()
        {
            Resultado = string.Empty;
        }
    }
}

