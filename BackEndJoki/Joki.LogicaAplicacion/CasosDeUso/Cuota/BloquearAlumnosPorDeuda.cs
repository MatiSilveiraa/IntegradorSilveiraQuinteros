using Joki.CasoUsoCompartida.InterfacesCasosUso.Cuota;
using Joki.LogicaNegocio.InterfacesRepositorio;

namespace Joki.LogicaAplicacion.CasosDeUso.Cuota
{
    public class BloquearAlumnosPorDeuda :
        IBloquearAlumnosPorDeuda
    {
        private readonly IRepositorioCuota _repositorioCuota;
        private readonly IRepositorioAlumno _repositorioAlumno;

        public BloquearAlumnosPorDeuda(
            IRepositorioCuota repositorioCuota,
            IRepositorioAlumno repositorioAlumno)
        {
            _repositorioCuota = repositorioCuota;
            _repositorioAlumno = repositorioAlumno;
        }

        public void Ejecutar()
        {
            DateTime hoy =
                DateTime.Now;

            int diasAtraso =
                7;

            var cuotasVencidas =
                _repositorioCuota
                    .ObtenerPendientesVencidasConAtraso(
                        hoy,
                        diasAtraso);

            foreach (var cuota in cuotasVencidas)
            {
                var alumno =
                    _repositorioAlumno.ObtenerPorId(
                        cuota.AlumnoId);

                if (alumno == null)
                {
                    continue;
                }

                if (!alumno.BloqueadoPorDeuda)
                {
                    alumno.BloqueadoPorDeuda = true;

                    _repositorioAlumno.Modificar(alumno);
                }
            }
        }
    }
}