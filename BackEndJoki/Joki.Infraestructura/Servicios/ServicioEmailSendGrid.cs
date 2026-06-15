using Joki.CasoUsoCompartida.Configuracion;
using Joki.LogicaNegocio.Excepciones;
using Joki.LogicaNegocio.InterfacesRepositorio;
using Microsoft.Extensions.Options;
using SendGrid;
using SendGrid.Helpers.Mail;

namespace Joki.Infraestructura.Servicios
{
    public class ServicioEmailSendGrid : IServicioEmail
    {
        private readonly EmailSettings _emailSettings;

        public ServicioEmailSendGrid(
            IOptions<EmailSettings> emailSettings)
        {
            _emailSettings = emailSettings.Value;
        }

        public void EnviarNotificacionInscripcion(
            string emailAlumno,
            string nombreGrupo)
        {
            EnviarEmail(
                emailAlumno,
                "Inscripción a grupo",
                $"Has sido inscripto automáticamente al grupo {nombreGrupo} desde la lista de espera.");
        }

        public void EnviarCodigoRecuperacion(
            string email,
            string codigo)
        {
            EnviarEmail(
                email,
                "Código de recuperación",
                $"Tu código de recuperación es: {codigo}");
        }

        private void EnviarEmail(
            string destinatario,
            string asunto,
            string mensaje)
        {
            var client =
                new SendGridClient(
                    _emailSettings.ApiKey);

            var from =
                new EmailAddress(
                    _emailSettings.SenderEmail,
                    _emailSettings.SenderName);

            var to =
                new EmailAddress(destinatario);

            var mail =
                MailHelper.CreateSingleEmail(
                    from,
                    to,
                    asunto,
                    mensaje,
                    mensaje);

            var response =
                client.SendEmailAsync(mail)
                    .GetAwaiter()
                    .GetResult();

            if (!response.IsSuccessStatusCode)
            {
                string error =
                    response.Body.ReadAsStringAsync()
                        .GetAwaiter()
                        .GetResult();

                throw new LogicaNegocioException(
                    $"No se pudo enviar el email. SendGrid respondió: {response.StatusCode}. {error}");
            }
        }
    }
}