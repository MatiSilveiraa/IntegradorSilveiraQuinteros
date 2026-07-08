namespace Joki.CasoUsoCompartida.DTOs.Alumno
{
    public class DtoAlumno
    {
        public int Id { get; set; }

        public string Nombre { get; set; }

        public string Apellido { get; set; }

        public string Email { get; set; }

        public string Estado { get; set; }

        public int CuotasPendientes { get; set; }

        public bool BloqueadoPorDeuda { get; set; }

        public bool BloqueadoPorInasistencias { get; set; }

        public DtoAlumno(
            int id,
            string nombre,
            string apellido,
            string email,
            string estado,
            int cuotasPendientes,
            bool bloqueadoPorDeuda,
            bool bloqueadoPorInasistencias)
        {
            Id = id;
            Nombre = nombre;
            Apellido = apellido;
            Email = email;
            Estado = estado;
            CuotasPendientes = cuotasPendientes;
            BloqueadoPorDeuda = bloqueadoPorDeuda;
            BloqueadoPorInasistencias = bloqueadoPorInasistencias;
        }
    }
}