namespace Joki.CasoUsoCompartida.InterfacesCasosUso.Beneficio
{
    public interface IEntregarBeneficioFisico
    {
        void Ejecutar(
            int beneficioId,
            int usuarioId);
    }
}