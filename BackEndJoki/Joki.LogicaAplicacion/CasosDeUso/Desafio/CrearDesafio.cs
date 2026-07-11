using Joki.CasoUsoCompartida.DTOs.Desafio;
using Joki.CasoUsoCompartida.InterfacesCasosUso.Desafio;
using Joki.LogicaNegocio.Excepciones;
using Joki.LogicaNegocio.InterfacesRepositorio;
using AuditoriaEntidad =
    Joki.LogicaNegocio.Entidades.Auditoria;
using DesafioEntidad =
    Joki.LogicaNegocio.Entidades.Desafio;

namespace Joki.LogicaAplicacion.CasosDeUso.Desafio
{
    public class CrearDesafio :
        ICrearDesafio
    {
        private readonly IRepositorioDesafio
            _repositorioDesafio;

        private readonly IRepositorioAuditoria
            _repositorioAuditoria;

        public CrearDesafio(
            IRepositorioDesafio repositorioDesafio,
            IRepositorioAuditoria repositorioAuditoria)
        {
            _repositorioDesafio =
                repositorioDesafio;

            _repositorioAuditoria =
                repositorioAuditoria;
        }

        public void Ejecutar(
            CrearDesafioRequest request,
            int usuarioId)
        {
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

            var desafio =
                new DesafioEntidad
                {
                    Titulo =
                        request.Titulo.Trim(),

                    Descripcion =
                        request.Descripcion?.Trim() ??
                        string.Empty,

                    FechaInicio = fechaInicio,
                    FechaFin = fechaFin,
                    Activo = true
                };

            _repositorioDesafio.Agregar(
                desafio);

            _repositorioAuditoria.Agregar(
                new AuditoriaEntidad
                {
                    UsuarioId = usuarioId,
                    Entidad = "Desafio",
                    EntidadId = desafio.Id,
                    Accion =
                        $"Creó el desafío {desafio.Titulo}",
                    Fecha = DateTime.UtcNow
                });
        }
    }
}