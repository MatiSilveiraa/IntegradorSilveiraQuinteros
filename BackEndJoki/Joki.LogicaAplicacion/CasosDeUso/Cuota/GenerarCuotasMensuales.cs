using Joki.CasoUsoCompartida.InterfacesCasosUso.Cuota;
using Joki.LogicaNegocio.Entidades;
using Joki.LogicaNegocio.Enums;
using Joki.LogicaNegocio.InterfacesRepositorio;

namespace Joki.LogicaAplicacion.CasosDeUso.Cuota
{
    public class GenerarCuotasMensuales : IGenerarCuotasMensuales
    {
        private readonly IRepositorioAlumno _repositorioAlumno;
        private readonly IRepositorioCuota _repositorioCuota;

        public GenerarCuotasMensuales(
            IRepositorioAlumno repositorioAlumno,
            IRepositorioCuota repositorioCuota)
        {
            _repositorioAlumno = repositorioAlumno;
            _repositorioCuota = repositorioCuota;
        }

        public void Ejecutar()
        {
            int mesActual = DateTime.Now.Month;
            int anioActual = DateTime.Now.Year;

            decimal montoBase = 1390m;

            var alumnosActivos =
                _repositorioAlumno.ObtenerActivos();

            foreach (var alumno in alumnosActivos)
            {
                var cuotaExistente =
                    _repositorioCuota.ObtenerPorAlumnoMesYAnio(
                        alumno.UsuarioId,
                        mesActual,
                        anioActual);

                if (cuotaExistente == null)
                {
                    var cuota = new Joki.LogicaNegocio.Entidades.Cuota
                    {
                        AlumnoId = alumno.UsuarioId,
                        Mes = mesActual,
                        Anio = anioActual,
                        FechaVencimiento =
                            new DateTime(anioActual, mesActual, 10),
                        MontoBase = montoBase,
                        Descuento = 0m,
                        MontoFinal = montoBase,
                        Estado = EstadoCuota.PENDIENTE
                    };

                    _repositorioCuota.Agregar(cuota);
                }
            }
        }
    }
}