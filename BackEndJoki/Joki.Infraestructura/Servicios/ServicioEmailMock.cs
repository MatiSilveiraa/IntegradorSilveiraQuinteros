using Joki.LogicaNegocio.InterfacesRepositorio;
using System.Diagnostics;

namespace Joki.Infraestructura.Servicios
{
    public class ServicioEmailMock : IServicioEmail
    {
        public void EnviarNotificacionInscripcion(string emailAlumno, string nombreGrupo)
        {
            // Simulación de envío de correo
            Debug.WriteLine($"[EMAIL MOCK] Enviando correo a {emailAlumno}: ¡Has sido inscripto automáticamente al grupo {nombreGrupo} desde la lista de espera!");
        }
    }
}