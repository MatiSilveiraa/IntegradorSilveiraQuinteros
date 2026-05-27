using Joki.CasoUsoCompartida.DTOs.Cuota;
using Joki.CasoUsoCompartida.InterfacesCasosUso.Cuota;
using Joki.LogicaNegocio.InterfacesRepositorio;

namespace Joki.LogicaAplicacion.CasosDeUso.Cuota
{
    public class ObtenerMisCuotas : IObtenerMisCuotas
    {
        private readonly IRepositorioCuota _repositorioCuota;

        public ObtenerMisCuotas(IRepositorioCuota repositorioCuota)
        {
            _repositorioCuota = repositorioCuota;
        }

        public IEnumerable<CuotaResponse> Ejecutar(int alumnoId)
        {
            var cuotas =
                _repositorioCuota.ObtenerPorAlumno(alumnoId);

            return cuotas.Select(c => new CuotaResponse
            {
                Id = c.Id,
                AlumnoId = c.AlumnoId,
                Mes = c.Mes,
                Anio = c.Anio,
                MontoBase = c.MontoBase,
                Descuento = c.Descuento,
                MontoFinal = c.MontoFinal,
                Estado = c.Estado.ToString()
            });
        }
    }
}