namespace Joki.LogicaNegocio.ValueObjects
{
    public class Ubicacion
    {
        public decimal Latitud { get; set; }
        public decimal Longitud { get; set; }

        public string CodigoPostal { get; set; }

        public Ubicacion()
        {
            CodigoPostal = string.Empty;
        }
    }
}