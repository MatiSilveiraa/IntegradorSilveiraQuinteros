using Joki.CasoUsoCompartida.DTOs.Perfil;
using Joki.CasoUsoCompartida.InterfacesCasosUso.Perfil;
using Joki.LogicaNegocio.InterfacesRepositorio;

namespace Joki.LogicaAplicacion.CasosDeUso.Perfil
{
    public class ObtenerPerfilUsuario : IObtenerPerfilUsuario
    {
        private readonly IRepositorioUsuario _repositorio;

        public ObtenerPerfilUsuario(IRepositorioUsuario repositorio)
        {
            _repositorio = repositorio;
        }

        public PerfilResponse Ejecutar(int usuarioId)
        {
            var usuario = _repositorio.ObtenerPorId(usuarioId);
            
            if (usuario == null)
            {
                throw new InvalidOperationException("El usuario solicitado no existe.");
            }

            return new PerfilResponse
            {
                Id = usuario.UsuarioId,
                Nombre = usuario.Nombre?.Valor ?? "",
                Apellido = usuario.Apellido?.Valor ?? "",
                Email = usuario.Email?.Valor ?? "",
                Celular = usuario.Celular?.Valor ??"",
                SociedadMedica = usuario.SociedadMedica,
                FechaNacimiento = usuario.FechaNacimiento,
                Genero = (int)usuario.Genero
            };
        }
    }
}
