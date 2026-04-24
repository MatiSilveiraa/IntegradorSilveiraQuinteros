using Joki.LogicaNegocio.Excepciones;
using System.Text.RegularExpressions;

namespace Joki.LogicaNegocio.ValueObjects
{
    public class Celular
    {
        public string Valor { get; private set; }

        public Celular()
        {
            Valor = string.Empty;
        }

    
        private Celular(string valor)
        {
            Valor = valor;
        }

    
        public static Celular Crear(string numero)
        {
            var celular = new Celular(numero?.Trim() ?? string.Empty);
            celular.Validar();
            return celular;
        }

        private void Validar()
        {
            if (string.IsNullOrWhiteSpace(Valor))
            {
                throw new LogicaNegocioException("El número de celular es obligatorio y no puede estar vacío.");
            }

         
            if (!Regex.IsMatch(Valor, @"^09\d{7}$"))
            {
                throw new LogicaNegocioException("El celular debe tener un formato válido de Uruguay de 9 dígitos (Ej: 099123456).");
            }
        }

        public override string ToString()
        {
            return Valor;
        }
    }
}