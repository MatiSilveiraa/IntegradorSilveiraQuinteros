using Joki.CasoUsoCompartida.DTOs.Autenticacion;
using Joki.CasoUsoCompartida.DTOs.Usuario;
using Joki.CasoUsoCompartida.InterfacesCasosUso.Autenticacion;
using Joki.LogicaNegocio.Enums;
using Joki.LogicaNegocio.InterfacesRepositorio;
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

        public ValidarLoginSinPassword(
            IRepositorioUsuario repositorioUsuario,
            IRepositorioCodigoLoginSinPassword repositorioCodigo)
        {
            _repositorioUsuario =
                repositorioUsuario;

            _repositorioCodigo =
                repositorioCodigo;
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

            var usuario =
                _repositorioUsuario.ObtenerPorEmail(
                    request.Email.Trim());

            if (usuario == null ||
                usuario.Estado != EstadoUsuario.ACTIVO)
            {
                return null;
            }

            var codigo =
                _repositorioCodigo
                    .ObtenerActivoPorUsuarioYCodigo(
                        usuario.UsuarioId,
                        request.Codigo.Trim());

            if (codigo == null)
            {
                return null;
            }

            codigo.Usado =
                true;

            _repositorioCodigo.Modificar(
                codigo);

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
    }
}