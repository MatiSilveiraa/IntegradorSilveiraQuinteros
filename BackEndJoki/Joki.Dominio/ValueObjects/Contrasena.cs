using Joki.LogicaNegocio.Excepciones.Usuario;

namespace Joki.LogicaNegocio.ValueObjects
{
    public class Contrasena
    {
        public string Valor { get; private set; }

        public Contrasena()
        {
            Valor = string.Empty;
        }

        private Contrasena(string valor)
        {
            Valor = valor;
        }

        public static Contrasena FromPlain(string contrasenaPlano)
        {
            Contrasena contrasena = new Contrasena(contrasenaPlano);
            contrasena.Validar();
            return contrasena;
        }

        public static Contrasena FromHash(string hash)
        {
            return new Contrasena(hash);
        }

        private void Validar()
        {
            if (string.IsNullOrWhiteSpace(Valor))
                throw new ContrasenaException("La contraseña no puede ser nula o vacía.");

            if (Valor.Length < 6)
                throw new ContrasenaException("La contraseña debe tener al menos 6 caracteres.");

            if (!Valor.Any(char.IsLetter))
                throw new ContrasenaException("La contraseña debe contener al menos una letra.");

            if (!Valor.Any(char.IsDigit))
                throw new ContrasenaException("La contraseña debe contener al menos un número.");

            if (!Valor.Any(c => "+.#!-".Contains(c)))
                throw new ContrasenaException("La contraseña debe contener al menos un carácter especial (+, ., #, !, -).");
        }

        public override string ToString()
        {
            return Valor;
        }
    }
}
