using Joki.CasoUsoCompartida.DTOs.Beneficio;
using Joki.CasoUsoCompartida.InterfacesCasosUso.Beneficio;
using Joki.LogicaNegocio.InterfacesRepositorio;

namespace Joki.LogicaAplicacion.CasosDeUso.Beneficio
{
    public class ObtenerBeneficiosFisicosPendientes :
        IObtenerBeneficiosFisicosPendientes
    {
        private readonly IRepositorioBeneficio _repositorioBeneficio;

        public ObtenerBeneficiosFisicosPendientes(
            IRepositorioBeneficio repositorioBeneficio)
        {
            _repositorioBeneficio = repositorioBeneficio;
        }

        public IEnumerable<BeneficioFisicoPendienteResponse> Ejecutar()
        {
            var beneficios =
                _repositorioBeneficio.ObtenerFisicosPendientes();

            return beneficios.Select(b =>
                new BeneficioFisicoPendienteResponse
                {
                    BeneficioId = b.Id,
                    AlumnoId = b.AlumnoId,
                    Nombre = b.Alumno.Nombre.ToString(),
                    Apellido = b.Alumno.Apellido.ToString(),
                    Descripcion = b.DescripcionBeneficio
                }).ToList();
        }
    }
}