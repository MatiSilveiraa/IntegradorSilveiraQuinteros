using Joki.CasoUsoCompartida.DTOs.Desafio;
using Joki.CasoUsoCompartida.InterfacesCasosUso.Desafio;
using Joki.LogicaNegocio.Excepciones;
using Joki.LogicaNegocio.InterfacesRepositorio;
using AuditoriaEntidad = Joki.LogicaNegocio.Entidades.Auditoria;

namespace Joki.LogicaAplicacion.CasosDeUso.Desafio
{
    public class CrearDesafio : ICrearDesafio
    {
        private readonly IRepositorioDesafio _repositorioDesafio;
        private readonly IRepositorioAuditoria _repositorioAuditoria;

        public CrearDesafio(
            IRepositorioDesafio repositorioDesafio,
            IRepositorioAuditoria repositorioAuditoria)
        {
            _repositorioDesafio = repositorioDesafio;
            _repositorioAuditoria = repositorioAuditoria;
        }

        public void Ejecutar(
            CrearDesafioRequest request,
            int usuarioId)
        {
            if (string.IsNullOrWhiteSpace(request.Titulo))
            {
                throw new LogicaNegocioException(
                    "El título es obligatorio");
            }

            if (request.FechaFin < request.FechaInicio)
            {
                throw new LogicaNegocioException(
                    "La fecha fin debe ser mayor a la fecha inicio");
            }

            var desafio =
                new Joki.LogicaNegocio.Entidades.Desafio
                {
                    Titulo = request.Titulo,
                    Descripcion = request.Descripcion,
                    FechaInicio = request.FechaInicio,
                    FechaFin = request.FechaFin
                };

            _repositorioDesafio.Agregar(desafio);

            _repositorioAuditoria.Agregar(
                new AuditoriaEntidad
                {
                    UsuarioId = usuarioId,
                    Entidad = "Desafio",
                    EntidadId = desafio.Id,
                    Accion = $"Creó el desafío {desafio.Titulo}",
                    Fecha = DateTime.UtcNow
                });
        }
    }
}