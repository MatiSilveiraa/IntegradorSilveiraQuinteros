using Joki.CasoUsoCompartida.DTOs.Usuario;

namespace Joki.WebApi.Services
{
    
        public interface IJwtGenerator
        {
            public string GenerateToken(DtoDatosUsuario usuario);
        }
    
}
