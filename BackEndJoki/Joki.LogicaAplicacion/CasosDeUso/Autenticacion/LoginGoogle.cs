using Google.Apis.Auth;
using Joki.CasoUsoCompartida.Configuracion;
using Joki.CasoUsoCompartida.DTOs.Autenticacion;
using Joki.CasoUsoCompartida.DTOs.Usuario;
using Joki.CasoUsoCompartida.InterfacesCasosUso.Autenticacion;
using Joki.CasoUsoCompartida.InterfacesCasosUso.Cuota;
using Joki.LogicaNegocio.Entidades;
using Joki.LogicaNegocio.Enums;
using Joki.LogicaNegocio.InterfacesRepositorio;
using Joki.LogicaNegocio.ValueObjects;
using Microsoft.Extensions.Options;
using alumnoEntidad = Joki.LogicaNegocio.Entidades.Alumno;
using entrenadorEntidad = Joki.LogicaNegocio.Entidades.Entrenador;

namespace Joki.LogicaAplicacion.CasosDeUso.Autenticacion
{
    public class LoginGoogle : ILoginGoogle
    {
        private readonly IRepositorioUsuario _repositorioUsuario;
        private readonly IRepositorioAlumno _repositorioAlumno;
        private readonly GoogleAuthSettings _googleSettings;
        private readonly IGenerarCuotaInicialAlumno _generarCuotaInicialAlumno;

        public LoginGoogle(
            IRepositorioUsuario repositorioUsuario,
            IRepositorioAlumno repositorioAlumno,
            IOptions<GoogleAuthSettings> googleSettings,
            IGenerarCuotaInicialAlumno generarCuotaInicialAlumno)
        {
            _repositorioUsuario = repositorioUsuario;
            _repositorioAlumno = repositorioAlumno;
            _googleSettings = googleSettings.Value;
            _generarCuotaInicialAlumno = generarCuotaInicialAlumno;
        }

        public DtoDatosUsuario? Ejecutar(
            LoginGoogleRequest request)
        {
            if (request == null ||
                string.IsNullOrWhiteSpace(request.IdToken))
            {
                return null;
            }

            string clientId =
                _googleSettings.ClientId;

            if (string.IsNullOrWhiteSpace(clientId))
            {
                return null;
            }

            GoogleJsonWebSignature.Payload payload;

            try
            {
                payload =
                    GoogleJsonWebSignature.ValidateAsync(
                        request.IdToken,
                        new GoogleJsonWebSignature.ValidationSettings
                        {
                            Audience = new[] { clientId }
                        }).Result;
            }
            catch
            {
                return null;
            }

            if (payload == null ||
                string.IsNullOrWhiteSpace(payload.Email) ||
                !payload.EmailVerified)
            {
                return null;
            }

            Usuario? usuario =
                _repositorioUsuario.ObtenerPorEmail(
                    payload.Email);

            if (usuario == null)
            {
                usuario = CrearAlumnoGoogle(payload);
            }

            if (usuario.Estado != EstadoUsuario.ACTIVO)
            {
                return null;
            }

            usuario.GoogleId = payload.Subject;
            usuario.ProveedorAutenticacion = "GOOGLE";
            usuario.UltimoAcceso = DateTime.UtcNow;

            _repositorioUsuario.Modificar(usuario);

            string rol =
                ObtenerRol(usuario);

            return new DtoDatosUsuario(
                usuario.UsuarioId,
                usuario.Nombre.Valor,
                usuario.Apellido.Valor,
                usuario.Email.Valor,
                rol
            );
        }

        private Usuario CrearAlumnoGoogle(
            GoogleJsonWebSignature.Payload payload)
        {
            string nombre =
                !string.IsNullOrWhiteSpace(payload.GivenName)
                    ? payload.GivenName
                    : "Usuario";

            string apellido =
                !string.IsNullOrWhiteSpace(payload.FamilyName)
                    ? payload.FamilyName
                    : "Google";

            alumnoEntidad alumno =
                    new alumnoEntidad
    {
                    Nombre = new Nombre(nombre),
                    Apellido = new Apellido(apellido),
                    Email = new Email(payload.Email),
                    Contrasena = Contrasena.FromHash(string.Empty),
                    ProveedorAutenticacion = "GOOGLE",
                    GoogleId = payload.Subject,
                    UltimoAcceso = DateTime.UtcNow,
                    Estado = EstadoUsuario.ACTIVO,
                    RolId = 3,
                    Peso = null,
                    Estatura = null,
                    IMC = null
                };

            int id =
                _repositorioAlumno.Agregar(alumno);

            alumno.UsuarioId = id;
            _generarCuotaInicialAlumno.Ejecutar(id);

            return alumno;
        }

        private string ObtenerRol(Usuario usuario)
        {
            if (usuario.Rol != null &&
                !string.IsNullOrWhiteSpace(usuario.Rol.Nombre))
            {
                return usuario.Rol.Nombre;
            }

            return usuario switch
            {
                entrenadorEntidad => "Entrenador",
                alumnoEntidad => "Alumno",
                _ => "Alumno"
            };
        }
    }
}