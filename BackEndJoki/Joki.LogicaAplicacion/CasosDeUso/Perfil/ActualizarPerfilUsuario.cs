using Joki.CasoUsoCompartida.DTOs.Perfil;
using Joki.CasoUsoCompartida.InterfacesCasosUso.Perfil;
using Joki.LogicaNegocio.Enums;
using Joki.LogicaNegocio.InterfacesRepositorio;
using Joki.LogicaNegocio.ValueObjects;

namespace Joki.LogicaAplicacion.CasosDeUso.Perfil
{
    public class ActualizarPerfilUsuario : IActualizarPerfilUsuario
    {
        private readonly IRepositorioUsuario _repositorio;

        public ActualizarPerfilUsuario(IRepositorioUsuario repositorio)
        {
            _repositorio = repositorio;
        }

        public PerfilResponse Ejecutar(int usuarioId, ActualizarPerfilRequest request)
        {
            if (request == null)
            {
                throw new ArgumentException("Los datos de actualización no pueden ser nulos.");
            }

            var usuario = _repositorio.ObtenerPorId(usuarioId);
            
            if (usuario == null)
            {
                throw new InvalidOperationException("El usuario solicitado no existe.");
            }

            usuario.Nombre = new Nombre(request.Nombre); 
            usuario.Apellido = new Apellido(request.Apellido);

            usuario.Celular = Celular.Crear(request.Celular); 

            usuario.SociedadMedica = request.SociedadMedica;
            usuario.FechaNacimiento = request.FechaNacimiento;

            if (Enum.IsDefined(typeof(Genero), request.Genero))
            {
                usuario.Genero = (Genero)request.Genero;
            }
            
            _repositorio.Modificar(usuario);

            return new PerfilResponse
            {
                Id = usuario.UsuarioId, 
                Nombre = usuario.Nombre.Valor,
                Apellido = usuario.Apellido.Valor,
                Email = usuario.Email.Valor,
                Celular = usuario.Celular.Valor,
                SociedadMedica = usuario.SociedadMedica,
                FechaNacimiento = usuario.FechaNacimiento,
                Genero = (int)usuario.Genero
            };
        }
    }
}
