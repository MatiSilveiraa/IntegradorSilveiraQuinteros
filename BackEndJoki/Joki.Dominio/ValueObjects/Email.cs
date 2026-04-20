namespace Joki.LogicaNegocio.ValueObjects
{
    public class Email
    {
        public string Valor { get; set; }

        public Email()
        {
            Valor = string.Empty;
        }

        public Email(string valor)
        {
            Valor = valor;
        }

        public override string ToString()
        {
            return Valor;
        }
    }
}
