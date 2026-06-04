using Joki.CasoUsoCompartida.DTOs.Autenticacion;
using Joki.CasoUsoCompartida.InterfacesCasosUso.Autenticacion;
using Joki.LogicaNegocio.Excepciones;
using Joki.LogicaNegocio.InterfacesRepositorio;
using Joki.LogicaNegocio.ValueObjects;
using Microsoft.AspNetCore.Identity;

namespace Joki.LogicaAplicacion.CasosDeUso.Autenticacion
{
    public class RestablecerContrasena :
        IRestablecerContrasena
    {
        private readonly IRepositorioUsuario _repositorioUsuario;
        private readonly IRepositorioRecuperacionContrasena _repositorioRecuperacion;

        public RestablecerContrasena(
            IRepositorioUsuario repositorioUsuario,
            IRepositorioRecuperacionContrasena repositorioRecuperacion)
        {
            _repositorioUsuario = repositorioUsuario;
            _repositorioRecuperacion = repositorioRecuperacion;
        }

        public void Ejecutar(
            RestablecerContrasenaRequest request)
        {
            var usuario =
                _repositorioUsuario.ObtenerPorEmail(
                    request.Email);

            if (usuario == null)
            {
                throw new LogicaNegocioException(
                    "No existe un usuario con ese email");
            }

            var recuperacion =
                _repositorioRecuperacion
                    .ObtenerActivaPorUsuarioYCodigo(
                        usuario.UsuarioId,
                        request.Codigo);

            if (recuperacion == null)
            {
                throw new LogicaNegocioException(
                    "Código inválido o expirado");
            }

            var passwordHasher =
                new PasswordHasher<object>();

            string hash =
                passwordHasher.HashPassword(
                    null!,
                    request.NuevaContrasena);

            usuario.Contrasena =
                Contrasena.FromHash(hash);

            _repositorioUsuario.Modificar(usuario);

            recuperacion.Usado = true;

            _repositorioRecuperacion
                .Modificar(recuperacion);
        }
    }
}