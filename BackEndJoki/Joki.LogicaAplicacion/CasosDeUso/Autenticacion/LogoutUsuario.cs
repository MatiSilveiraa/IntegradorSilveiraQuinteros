using Joki.CasoUsoCompartida.InterfacesCasosUso.Autenticacion;
using Joki.LogicaNegocio.Entidades;
using Joki.LogicaNegocio.Excepciones;
using Joki.LogicaNegocio.InterfacesRepositorio;

namespace Joki.LogicaAplicacion.CasosDeUso.Autenticacion
{
    public class LogoutUsuario : ILogoutUsuario
    {
        private readonly IRepositorioTokenRevocado _repositorio;

        public LogoutUsuario(IRepositorioTokenRevocado repositorio)
        {
            _repositorio = repositorio;
        }

        public void Ejecutar(string token)
        {
            if (string.IsNullOrWhiteSpace(token))
            {
                throw new LogicaNegocioException("Token inválido.");
            }

            if (_repositorio.Existe(token))
            {
                throw new LogicaNegocioException("El token ya fue revocado.");
            }

            _repositorio.Agregar(new TokenRevocado
            {
                Token = token,
                FechaRevocacion = DateTime.UtcNow
            });
        }
    }
}
