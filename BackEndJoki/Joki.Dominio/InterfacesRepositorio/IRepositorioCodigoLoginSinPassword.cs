using Joki.LogicaNegocio.Entidades;

namespace Joki.LogicaNegocio.InterfacesRepositorio
{
    public interface IRepositorioCodigoLoginSinPassword
    {
        void Agregar(CodigoLoginSinPassword codigo);

        CodigoLoginSinPassword? ObtenerActivoPorUsuarioYCodigo(
            int usuarioId,
            string codigo);

        CodigoLoginSinPassword? ObtenerUltimoPendientePorUsuario(
            int usuarioId);

        void Modificar(CodigoLoginSinPassword codigo);
    }
}