using Joki.CasoUsoCompartida.DTOs.Autenticacion;
using Joki.CasoUsoCompartida.DTOs.Usuario;
using Joki.CasoUsoCompartida.InterfacesCasosUso.Autenticacion;
using Joki.LogicaNegocio.Excepciones;
using Joki.LogicaNegocio.InterfacesRepositorio;

namespace Joki.LogicaAplicacion.CasosDeUso.Autenticacion
{
    public class ValidarLoginSinPassword :
        IValidarLoginSinPassword
    {
        private readonly IRepositorioUsuario _repositorioUsuario;
        private readonly IRepositorioCodigoLoginSinPassword _repositorioCodigo;

        public ValidarLoginSinPassword(
            IRepositorioUsuario repositorioUsuario,
            IRepositorioCodigoLoginSinPassword repositorioCodigo)
        {
            _repositorioUsuario = repositorioUsuario;
            _repositorioCodigo = repositorioCodigo;
        }

        public DtoDatosUsuario? Ejecutar(
            ValidarLoginSinPasswordRequest request)
        {
            var usuario =
                _repositorioUsuario.ObtenerPorEmail(
                    request.Email);

            if (usuario == null)
            {
                throw new LogicaNegocioException(
                    "Usuario no encontrado");
            }

            var codigo =
                _repositorioCodigo
                    .ObtenerActivoPorUsuarioYCodigo(
                        usuario.UsuarioId,
                        request.Codigo);

            if (codigo == null)
            {
                throw new LogicaNegocioException(
                    "Código inválido o expirado");
            }

            codigo.Usado = true;

            _repositorioCodigo.Modificar(codigo);

            string rol =
                usuario.Rol?.Nombre ?? "Alumno";

            return new DtoDatosUsuario(
                usuario.UsuarioId,
                usuario.Nombre.Valor,
                usuario.Apellido.Valor,
                usuario.Email.Valor,
                rol);
        }
    }
}