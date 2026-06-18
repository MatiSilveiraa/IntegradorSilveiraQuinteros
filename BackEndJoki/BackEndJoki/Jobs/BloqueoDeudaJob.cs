using Joki.CasoUsoCompartida.InterfacesCasosUso.Cuota;

namespace Joki.WebApi.Jobs
{
    public class BloqueoDeudaJob
    {
        private readonly IBloquearAlumnosPorDeuda _bloquearAlumnosPorDeuda;

        public BloqueoDeudaJob(
            IBloquearAlumnosPorDeuda bloquearAlumnosPorDeuda)
        {
            _bloquearAlumnosPorDeuda = bloquearAlumnosPorDeuda;
        }

        public void Ejecutar()
        {
            _bloquearAlumnosPorDeuda.Ejecutar();
        }
    }
}