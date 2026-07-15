using Joki.CasoUsoCompartida.Configuracion;
using Joki.CasoUsoCompartida.DTOs.Autenticacion;
using Joki.CasoUsoCompartida.DTOs.Usuario;
using Joki.CasoUsoCompartida.InterfacesCasosUso.Autenticacion;
using Joki.LogicaNegocio.Enums;
using Joki.LogicaNegocio.InterfacesRepositorio;
using Microsoft.Extensions.Options;
using alumnoEntidad = Joki.LogicaNegocio.Entidades.Alumno;
using entrenadorEntidad = Joki.LogicaNegocio.Entidades.Entrenador;

namespace Joki.LogicaAplicacion.CasosDeUso.Autenticacion
{
    public class ValidarLoginSinPassword :
        IValidarLoginSinPassword
    {
        private readonly IRepositorioUsuario
            _repositorioUsuario;

        private readonly IRepositorioCodigoLoginSinPassword
            _repositorioCodigo;

        private readonly DemoSettings
            _demoSettings;

        public ValidarLoginSinPassword(
            IRepositorioUsuario repositorioUsuario,
            IRepositorioCodigoLoginSinPassword repositorioCodigo,
            IOptions<DemoSettings> demoSettings)
        {
            _repositorioUsuario =
                repositorioUsuario;

            _repositorioCodigo =
                repositorioCodigo;

            _demoSettings =
                demoSettings.Value;
        }

        public DtoDatosUsuario? Ejecutar(
            ValidarLoginSinPasswordRequest request)
        {
            if (request == null ||
                string.IsNullOrWhiteSpace(request.Email) ||
                string.IsNullOrWhiteSpace(request.Codigo))
            {
                return null;
            }

            string email =
                request.Email.Trim();

            string codigoIngresado =
                request.Codigo.Trim();

            var usuario =
                _repositorioUsuario.ObtenerPorEmail(
                    email);

            if (usuario == null ||
                usuario.Estado != EstadoUsuario.ACTIVO)
            {
                return null;
            }

            var codigoReal =
                _repositorioCodigo
                    .ObtenerActivoPorUsuarioYCodigo(
                        usuario.UsuarioId,
                        codigoIngresado);

            bool codigoDemoValido =
                EsCodigoDemoValido(
                    email,
                    codigoIngresado);

            if (codigoReal == null &&
                !codigoDemoValido)
            {
                return null;
            }

            if (codigoReal != null)
            {
                codigoReal.Usado = true;

                _repositorioCodigo.Modificar(
                    codigoReal);
            }

            usuario.UltimoAcceso =
                DateTime.UtcNow;

            _repositorioUsuario.Modificar(
                usuario);

            string rol;

            if (usuario.Rol != null &&
                !string.IsNullOrWhiteSpace(
                    usuario.Rol.Nombre))
            {
                rol = usuario.Rol.Nombre;
            }
            else
            {
                rol = usuario switch
                {
                    entrenadorEntidad => "Entrenador",
                    alumnoEntidad => "Alumno",
                    _ => "Alumno"
                };
            }

            return new DtoDatosUsuario(
                usuario.UsuarioId,
                usuario.Nombre.Valor,
                usuario.Apellido.Valor,
                usuario.Email.Valor,
                rol);
        }

        private bool EsCodigoDemoValido(
            string email,
            string codigo)
        {
            if (!_demoSettings.Habilitado)
            {
                return false;
            }

            bool emailPermitido =
                _demoSettings.EmailsPermitidos.Any(
                    emailConfigurado =>
                        emailConfigurado.Equals(
                            email,
                            StringComparison.OrdinalIgnoreCase));

            if (!emailPermitido)
            {
                return false;
            }

            return codigo ==
                   _demoSettings.CodigoPasswordless;
        }
    }
}