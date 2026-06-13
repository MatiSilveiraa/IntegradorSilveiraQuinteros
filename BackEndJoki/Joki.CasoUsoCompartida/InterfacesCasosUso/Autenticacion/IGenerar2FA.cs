using Joki.CasoUsoCompartida.DTOs.Autenticacion;

namespace Joki.CasoUsoCompartida.InterfacesCasosUso.Autenticacion
{
    public interface IGenerar2FA
    {
        Generar2FAResponse Ejecutar(
            int usuarioId);
    }
}