using Joki.LogicaNegocio.Excepciones.Usuario;

namespace Joki.LogicaNegocio.ValueObjects
{
    public class Email
    {
        public string Valor { get; private set; }

        public Email()
        {
            Valor = string.Empty;
        }

        public Email(string valor)
        {
            Valor = valor;
            Validar();
        }

        private void Validar()
        {
            if (string.IsNullOrWhiteSpace(Valor))
                throw new EmailException("El email no puede ser nulo o vacío.");

            if (!Valor.Contains("@"))
                throw new EmailException("El email no tiene un formato válido.");
        }

        public override string ToString()
        {
            return Valor;
        }
    }
}
