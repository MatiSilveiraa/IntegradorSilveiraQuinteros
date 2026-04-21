using Joki.CasoUsoCompartida.DTOs.Usuario;
using Joki.LogicaNegocio.Entidades;

namespace Joki.LogicaAplicacion.Mappers
{
    public class MapperUsuario
    {
        public DtoDatosUsuario ToDtoDatosUsuario(Usuario usuario)
        {
            string rol = "Alumno";

            if (usuario is Entrenador)
            {
                rol = "Entrenador";
            }

            return new DtoDatosUsuario(
                Id: usuario.UsuarioId,
                Nombre: usuario.Nombre.Valor,
                Apellido: usuario.Apellido.Valor,
                Email: usuario.Email.Valor,
                Rol: rol
            );
        }
    }
}
