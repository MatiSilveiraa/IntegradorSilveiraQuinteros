namespace Joki.LogicaNegocio.ValueObjects
{
    public class Ubicacion
    {
        public string CodigoPostal { get; set; }

        public decimal Latitud { get; set; }

        public decimal Longitud { get; set; }

        public string? Direccion { get; set; }

        public Ubicacion()
        {
            CodigoPostal = string.Empty;
            Direccion = string.Empty;
        }

        public Ubicacion(
            string codigoPostal,
            decimal latitud,
            decimal longitud,
            string? direccion = null)
        {
            CodigoPostal = codigoPostal;
            Latitud = latitud;
            Longitud = longitud;
            Direccion = direccion ?? string.Empty;
        }
    }
}