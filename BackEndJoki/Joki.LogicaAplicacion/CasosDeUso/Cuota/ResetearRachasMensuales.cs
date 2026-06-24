using Joki.CasoUsoCompartida.InterfacesCasosUso.Cuota;
using Joki.LogicaNegocio.InterfacesRepositorio;

namespace Joki.LogicaAplicacion.CasosDeUso.Cuota
{
    public class ResetearRachasMensuales :
        IResetearRachasMensuales
    {
        private readonly IRepositorioAlumno _repositorioAlumno;

        public ResetearRachasMensuales(
            IRepositorioAlumno repositorioAlumno)
        {
            _repositorioAlumno = repositorioAlumno;
        }

        public void Ejecutar()
        {
            DateTime hoy =
                DateTime.Now;

            var alumnos =
                _repositorioAlumno.ObtenerActivos();

            foreach (var alumno in alumnos)
            {
                bool rachaEsDeOtroMes =
                    alumno.MesRachaAsistencia != hoy.Month ||
                    alumno.AnioRachaAsistencia != hoy.Year;

                if (rachaEsDeOtroMes)
                {
                    alumno.RachaAsistenciaMensual = 0;
                    alumno.DescuentoRachaGenerado = false;
                    alumno.MesRachaAsistencia = hoy.Month;
                    alumno.AnioRachaAsistencia = hoy.Year;

                    _repositorioAlumno.Modificar(alumno);
                }
            }
        }
    }
}