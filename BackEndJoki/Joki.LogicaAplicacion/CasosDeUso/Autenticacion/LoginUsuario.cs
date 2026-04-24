using Joki.CasoUsoCompartida.DTOs.Autenticacion;
using Joki.CasoUsoCompartida.DTOs.Usuario;
using Joki.CasoUsoCompartida.InterfacesCasosUso.Autenticacion;
using Joki.LogicaNegocio.Entidades;
using Joki.LogicaNegocio.Enums;
using Joki.LogicaNegocio.InterfacesRepositorio;
using Microsoft.AspNetCore.Identity;

namespace Joki.LogicaAplicacion.CasosDeUso.Autenticacion
{
    public class LoginUsuario : ILoginUsuario
    {
        private readonly IRepositorioUsuario _repositorioUsuario;
        private readonly PasswordHasher<object> _hasheador;

        public LoginUsuario(IRepositorioUsuario repositorioUsuario)
        {
            _repositorioUsuario = repositorioUsuario;
            _hasheador = new PasswordHasher<object>();
        }

        public DtoDatosUsuario? Ejecutar(LoginRequest request)
        {
            // 🔴 Validaciones básicas
            if (request == null ||
                string.IsNullOrWhiteSpace(request.Email) ||
                string.IsNullOrWhiteSpace(request.Password))
            {
                return null;
            }

            // 🔍 Buscar usuario
            Usuario? usuario = _repositorioUsuario.ObtenerPorEmail(request.Email);

            if (usuario == null)
            {
                return null;
            }

            // 🔴 Validar estado
            if (usuario.Estado != EstadoUsuario.ACTIVO)
            {
                return null;
            }

            // 🔐 Validar contraseña
            var resultado = _hasheador.VerifyHashedPassword(
                null,
                usuario.Contrasena.Valor,
                request.Password
            );

            if (resultado != PasswordVerificationResult.Success)
            {
                return null;
            }

            // 🔥 MANEJO SEGURO DEL ROL
            string rol;

            if (usuario.Rol != null && !string.IsNullOrWhiteSpace(usuario.Rol.Nombre))
            {
                rol = usuario.Rol.Nombre;
            }
            else
            {
                // fallback para no romper tests
                rol = usuario switch
                {
                    Entrenador => "Entrenador",
                    Alumno => "Alumno",
                    _ => "Alumno"
                };
            }

            // ✅ DTO FINAL
            return new DtoDatosUsuario(
                usuario.UsuarioId,
                usuario.Nombre.Valor,
                usuario.Apellido.Valor,
                usuario.Email.Valor,
                rol
            );
        }
    }
}