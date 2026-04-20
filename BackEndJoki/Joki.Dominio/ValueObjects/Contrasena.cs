namespace Joki.LogicaNegocio.ValueObjects
{
    public class Contrasena
    {
        public string Valor { get; set; }

        public Contrasena()
        {
            Valor = string.Empty;
        }

        public Contrasena(string valor)
        {
            Valor = valor;
        }

        public override string ToString()
        {
            return Valor;
        }
    }
}
