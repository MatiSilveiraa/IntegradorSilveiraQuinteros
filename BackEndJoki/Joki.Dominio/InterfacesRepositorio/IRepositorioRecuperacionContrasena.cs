using Joki.LogicaNegocio.Entidades;

namespace Joki.LogicaNegocio.InterfacesRepositorio
{
    public interface IRepositorioRecuperacionContrasena
    {
        void Agregar(RecuperacionContrasena recuperacion);

        RecuperacionContrasena? ObtenerActivaPorUsuarioYCodigo(
            int usuarioId,
            string codigo);

        void Modificar(RecuperacionContrasena recuperacion);
    }
}
