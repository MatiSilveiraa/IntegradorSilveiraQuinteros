namespace Joki.LogicaNegocio.ValueObjects
{
    public class Ubicacion
    {
        public float Longitud { get; set; }
        public float Latitud { get; set; }
        public string CodigoPostal { get; set; }

        public Ubicacion()
        {
            CodigoPostal = string.Empty;
        }
    }
}
