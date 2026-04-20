namespace Joki.LogicaNegocio.ValueObjects
{
    public class Nombre
    {
        public string Valor { get; set; }

        public Nombre()
        {
            Valor = string.Empty;
        }

        public Nombre(string valor)
        {
            Valor = valor;
        }

        public override string ToString()
        {
            return Valor;
        }
    }
}
