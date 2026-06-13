using Joki.CasoUsoCompartida.DTOs.Autenticacion;

namespace Joki.CasoUsoCompartida.InterfacesCasosUso.Autenticacion
{
    public interface IConfirmar2FA
    {
        void Ejecutar(
            int usuarioId,
            Confirmar2FARequest request);
    }
}