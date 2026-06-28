using Joki.CasoUsoCompartida.DTOs.Beneficio;
using Joki.CasoUsoCompartida.InterfacesCasosUso.Beneficio;
using Joki.LogicaNegocio.InterfacesRepositorio;

namespace Joki.LogicaAplicacion.CasosDeUso.Beneficio
{
    public class ObtenerBeneficiosPendientesAdmin :
        IObtenerBeneficiosPendientesAdmin
    {
        private readonly IRepositorioBeneficio _repositorioBeneficio;

        public ObtenerBeneficiosPendientesAdmin(
            IRepositorioBeneficio repositorioBeneficio)
        {
            _repositorioBeneficio = repositorioBeneficio;
        }

        public IEnumerable<BeneficioPendienteAdminResponse> Ejecutar()
        {
            var beneficios =
                _repositorioBeneficio.ObtenerPendientes();

            return beneficios.Select(b =>
                new BeneficioPendienteAdminResponse
                {
                    BeneficioId = b.Id,
                    AlumnoId = b.AlumnoId,
                    NombreAlumno = b.Alumno.Nombre.Valor,
                    ApellidoAlumno = b.Alumno.Apellido.Valor,
                    Descripcion = b.DescripcionBeneficio,
                    Estado = b.Estado.ToString(),
                    MesesAplicados = b.MesesAplicados,
                    MesesDuracion = b.MesesDuracion,
                    CuotaGratis = b.CuotaGratis,
                    Descuento = b.Descuento != null ? b.Descuento.Porcentaje : null
                }).ToList();
        }
    }
}