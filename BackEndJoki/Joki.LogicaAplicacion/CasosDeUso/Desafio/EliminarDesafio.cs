using Joki.CasoUsoCompartida.InterfacesCasosUso.Desafio;
using Joki.LogicaNegocio.Excepciones;
using Joki.LogicaNegocio.InterfacesRepositorio;
using AuditoriaEntidad = Joki.LogicaNegocio.Entidades.Auditoria;

namespace Joki.LogicaAplicacion.CasosDeUso.Desafio
{
    public class EliminarDesafio :
        IEliminarDesafio
    {
        private readonly IRepositorioDesafio _repositorioDesafio;
        private readonly IRepositorioAuditoria _repositorioAuditoria;

        public EliminarDesafio(
            IRepositorioDesafio repositorioDesafio,
            IRepositorioAuditoria repositorioAuditoria)
        {
            _repositorioDesafio = repositorioDesafio;
            _repositorioAuditoria = repositorioAuditoria;
        }

        public void Ejecutar(
            int id,
            int usuarioId)
        {
            var desafio =
                _repositorioDesafio.ObtenerPorId(id);

            if (desafio == null || !desafio.Activo)
            {
                throw new LogicaNegocioException(
                    "No existe el desafío");
            }

            desafio.Activo = false;

            _repositorioDesafio.Modificar(desafio);

            _repositorioAuditoria.Agregar(
                new AuditoriaEntidad
                {
                    UsuarioId = usuarioId,
                    Entidad = "Desafio",
                    EntidadId = desafio.Id,
                    Accion = $"Eliminó el desafío {desafio.Titulo}",
                    Fecha = DateTime.UtcNow
                });
        }
    }
}