using Joki.LogicaNegocio.InterfacesRepositorio;
using System.Diagnostics;

namespace Joki.Infraestructura.Servicios
{
    public class ServicioEmailMock : IServicioEmail
    {
        public void EnviarNotificacionInscripcion(
            string emailAlumno,
            string nombreGrupo)
        {
            Debug.WriteLine(
                $"[EMAIL MOCK] Enviando correo a {emailAlumno}: ¡Has sido inscripto automáticamente al grupo {nombreGrupo} desde la lista de espera!");
        }

        public void EnviarCodigoRecuperacion(
            string email,
            string codigo)
        {
            Debug.WriteLine(
                $"[EMAIL MOCK] Código de recuperación para {email}: {codigo}");
        }
    }
}