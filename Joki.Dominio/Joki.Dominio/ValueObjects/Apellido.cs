namespace Joki.LogicaNegocio.ValueObjects
{
    public class Apellido
    {
        public string Valor { get; set; }

        public Apellido()
        {
            Valor = string.Empty;
        }

        public Apellido(string valor)
        {
            Valor = valor;
        }

        public override string ToString()
        {
            return Valor;
        }
    }
}
