using Joki.CasoUsoCompartida.DTOs.Autenticacion;
using Joki.CasoUsoCompartida.DTOs.Usuario;
using Joki.CasoUsoCompartida.InterfacesCasosUso.Autenticacion;
using Joki.LogicaAplicacion.Mappers;
using Joki.LogicaNegocio.Entidades;
using Joki.LogicaNegocio.Enums;
using Joki.LogicaNegocio.InterfacesRepositorio;
using Microsoft.AspNetCore.Identity;

namespace Joki.LogicaAplicacion.CasosDeUso.Autenticacion
{
    public class LoginUsuario : ILoginUsuario
    {
        private readonly IRepositorioUsuario _repositorioUsuario;

        public LoginUsuario(IRepositorioUsuario repositorioUsuario)
        {
            _repositorioUsuario = repositorioUsuario;
        }

        public DtoDatosUsuario? Ejecutar(LoginRequest request)
        {
            if (request == null)
            {
                return null;
            }

            if (string.IsNullOrWhiteSpace(request.Email) ||
                string.IsNullOrWhiteSpace(request.Password))
            {
                return null;
            }

            Usuario? usuario = _repositorioUsuario.ObtenerPorEmail(request.Email);

            if (usuario == null)
            {
                return null;
            }

            if (usuario.Estado != EstadoUsuario.ACTIVO)
            {
                return null;
            }

            var hasheador = new PasswordHasher<object>();
            var resultado = hasheador.VerifyHashedPassword(null, usuario.Contrasena.Valor, request.Password);

            if (resultado != PasswordVerificationResult.Success)
            {
                return null;
            }

            MapperUsuario mapperUsuario = new MapperUsuario();
            return mapperUsuario.ToDtoDatosUsuario(usuario);
        }
    }
}
