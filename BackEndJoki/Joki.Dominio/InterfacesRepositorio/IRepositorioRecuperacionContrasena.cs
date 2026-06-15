using Joki.LogicaNegocio.Entidades;

namespace Joki.LogicaNegocio.InterfacesRepositorio
{
    public interface IRepositorioRecuperacionContrasena
    {
        void Agregar(RecuperacionContrasena recuperacion);

        RecuperacionContrasena? ObtenerActivaPorUsuarioYCodigo(
            int usuarioId,
            string codigo);

        RecuperacionContrasena? ObtenerUltimaPorUsuario(
            int usuarioId);

        void Modificar(RecuperacionContrasena recuperacion);
    }
}