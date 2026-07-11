using Joki.CasoUsoCompartida.DTOs.Desafio;
using Joki.CasoUsoCompartida.InterfacesCasosUso.Desafio;
using Joki.LogicaNegocio.Excepciones;
using Joki.LogicaNegocio.InterfacesRepositorio;
using AuditoriaEntidad =
    Joki.LogicaNegocio.Entidades.Auditoria;

namespace Joki.LogicaAplicacion.CasosDeUso.Desafio
{
    public class ActualizarDesafio :
        IActualizarDesafio
    {
        private readonly IRepositorioDesafio
            _repositorioDesafio;

        private readonly IRepositorioAuditoria
            _repositorioAuditoria;

        public ActualizarDesafio(
            IRepositorioDesafio repositorioDesafio,
            IRepositorioAuditoria repositorioAuditoria)
        {
            _repositorioDesafio =
                repositorioDesafio;

            _repositorioAuditoria =
                repositorioAuditoria;
        }

        public void Ejecutar(
            int id,
            ActualizarDesafioRequest request,
            int usuarioId)
        {
            var desafio =
                _repositorioDesafio.ObtenerPorId(id);

            if (desafio == null ||
                !desafio.Activo)
            {
                throw new LogicaNegocioException(
                    "No existe el desafío");
            }

            if (request == null)
            {
                throw new LogicaNegocioException(
                    "Debe enviar los datos del desafío");
            }

            if (string.IsNullOrWhiteSpace(
                request.Titulo))
            {
                throw new LogicaNegocioException(
                    "El título es obligatorio");
            }

            DateTime fechaInicio =
                request.FechaInicio.Date;

            DateTime fechaFin =
                request.FechaFin.Date;

            if (fechaFin < fechaInicio)
            {
                throw new LogicaNegocioException(
                    "La fecha fin no puede ser anterior a la fecha inicio");
            }

            desafio.Titulo =
                request.Titulo.Trim();

            desafio.Descripcion =
                request.Descripcion?.Trim() ??
                string.Empty;

            desafio.FechaInicio =
                fechaInicio;

            desafio.FechaFin =
                fechaFin;

            _repositorioDesafio.Modificar(
                desafio);

            _repositorioAuditoria.Agregar(
                new AuditoriaEntidad
                {
                    UsuarioId = usuarioId,
                    Entidad = "Desafio",
                    EntidadId = desafio.Id,
                    Accion =
                        $"Actualizó el desafío {desafio.Titulo}",
                    Fecha = DateTime.UtcNow
                });
        }
    }
}