using Joki.CasoUsoCompartida.DTOs.Usuario;

namespace Joki.CasoUsoCompartida.DTOs.Autenticacion
{
    public class LoginResponse
    {
        public bool Requiere2FA { get; set; }

        public string? Token { get; set; }

        public DtoDatosUsuario? Usuario { get; set; }

        public string? Email { get; set; }
    }
}