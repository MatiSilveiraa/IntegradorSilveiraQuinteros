using Joki.CasoUsoCompartida.InterfacesCasosUso.Beneficio;
using Joki.LogicaNegocio.Enums;
using Joki.LogicaNegocio.Excepciones;
using Joki.LogicaNegocio.InterfacesRepositorio;
using AuditoriaEntidad = Joki.LogicaNegocio.Entidades.Auditoria;

namespace Joki.LogicaAplicacion.CasosDeUso.Beneficio
{
    public class EntregarBeneficioFisico :
        IEntregarBeneficioFisico
    {
        private readonly IRepositorioBeneficio _repositorioBeneficio;
        private readonly IRepositorioAuditoria _repositorioAuditoria;

        public EntregarBeneficioFisico(
            IRepositorioBeneficio repositorioBeneficio,
            IRepositorioAuditoria repositorioAuditoria)
        {
            _repositorioBeneficio = repositorioBeneficio;
            _repositorioAuditoria = repositorioAuditoria;
        }

        public void Ejecutar(
            int beneficioId,
            int usuarioId)
        {
            var beneficio =
                _repositorioBeneficio.ObtenerPorId(beneficioId);

            if (beneficio == null)
            {
                throw new LogicaNegocioException(
                    "No existe el beneficio");
            }

            if (beneficio.CuotaGratis ||
                beneficio.DescuentoId != null)
            {
                throw new LogicaNegocioException(
                    "Solo se pueden entregar beneficios físicos");
            }

            if (beneficio.Estado != EstadoBeneficio.PENDIENTE)
            {
                throw new LogicaNegocioException(
                    "El beneficio no está pendiente");
            }

            beneficio.Estado =
                EstadoBeneficio.OTORGADO;

            _repositorioBeneficio.Modificar(beneficio);

            _repositorioAuditoria.Agregar(
                new AuditoriaEntidad
                {
                    UsuarioId = usuarioId,
                    Entidad = "Beneficio",
                    EntidadId = beneficio.Id,
                    Accion =
                        $"Entregó beneficio físico Id {beneficio.Id} al alumno Id {beneficio.AlumnoId}",
                    Fecha = DateTime.UtcNow
                });
        }
    }
}