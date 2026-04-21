using Joki.LogicaNegocio.Excepciones.Usuario;

namespace Joki.LogicaNegocio.ValueObjects
{
    public class Apellido
    {
        public string Valor { get; private set; }

        public Apellido()
        {
            Valor = string.Empty;
        }

        public Apellido(string valor)
        {
            Valor = valor;
            Validar();
        }

        private void Validar()
        {
            if (string.IsNullOrWhiteSpace(Valor))
                throw new ApellidoException("El apellido no puede ser nulo o vacío.");
        }

        public override string ToString()
        {
            return Valor;
        }
    }
}
