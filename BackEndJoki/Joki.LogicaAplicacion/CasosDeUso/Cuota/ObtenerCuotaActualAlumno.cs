using Joki.CasoUsoCompartida.DTOs.Cuota;
using Joki.CasoUsoCompartida.InterfacesCasosUso.Cuota;
using Joki.LogicaNegocio.Excepciones;
using Joki.LogicaNegocio.InterfacesRepositorio;

namespace Joki.LogicaAplicacion.CasosDeUso.Cuota
{
    public class ObtenerCuotaActualAlumno : IObtenerCuotaActualAlumno
    {
        private readonly IRepositorioCuota _repositorioCuota;

        public ObtenerCuotaActualAlumno(
            IRepositorioCuota repositorioCuota)
        {
            _repositorioCuota = repositorioCuota;
        }

        public CuotaResponse Ejecutar(int alumnoId)
        {
            int mesActual = DateTime.Now.Month;

            int anioActual = DateTime.Now.Year;

            var cuota =
                _repositorioCuota.ObtenerPorAlumnoMesYAnio(
                    alumnoId,
                    mesActual,
                    anioActual);

            if (cuota == null)
            {
                throw new LogicaNegocioException(
                    "No existe cuota generada para el mes actual");
            }

            return new CuotaResponse
            {
                Id = cuota.Id,

                AlumnoId = cuota.AlumnoId,

                Mes = cuota.Mes,

                Anio = cuota.Anio,

                MontoBase = cuota.MontoBase,

                Descuento = cuota.Descuento,

                MontoFinal = cuota.MontoFinal,

                Estado = cuota.Estado.ToString()
            };
        }
    }
}
