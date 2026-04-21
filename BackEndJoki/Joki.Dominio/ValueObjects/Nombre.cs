using Joki.LogicaNegocio.Excepciones;

namespace Joki.LogicaNegocio.ValueObjects
{
    public class Nombre
    {
        public string Valor { get; private set; }

        public Nombre()
        {
            Valor = string.Empty;
        }

        public Nombre(string valor)
        {
            Valor = valor;
            Validar();
        }

        private void Validar()
        {
            if (string.IsNullOrWhiteSpace(Valor))
                throw new NombreException("El nombre no puede ser nulo o vacío.");
        }

        public override string ToString()
        {
            return Valor;
        }
    }
}
