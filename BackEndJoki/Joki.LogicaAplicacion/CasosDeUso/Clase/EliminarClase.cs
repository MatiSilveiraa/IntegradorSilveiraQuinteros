using Joki.CasoUsoCompartida.InterfacesCasosUso.Clase;
using Joki.LogicaNegocio.Excepciones;
using Joki.LogicaNegocio.InterfacesRepositorio;
using AuditoriaEntidad = Joki.LogicaNegocio.Entidades.Auditoria;

namespace Joki.LogicaAplicacion.CasosDeUso.Clase
{
    public class EliminarClase : IEliminarClase
    {
        private readonly IRepositorioClase _repositorioClase;
        private readonly IRepositorioAuditoria _repositorioAuditoria;

        public EliminarClase(
            IRepositorioClase repositorioClase,
            IRepositorioAuditoria repositorioAuditoria)
        {
            _repositorioClase = repositorioClase;
            _repositorioAuditoria = repositorioAuditoria;
        }

        public void Ejecutar(
            int id,
            int usuarioId)
        {
            var clase =
                _repositorioClase.ObtenerPorId(id);

            if (clase == null)
            {
                throw new LogicaNegocioException(
                    "La clase no existe");
            }

            int grupoId =
                clase.GrupoId;

            var diaSemana =
                clase.DiaSemana;

            var horaInicio =
                clase.HoraInicio;

            var horaFin =
                clase.HoraFin;

            _repositorioClase.Eliminar(id);

            _repositorioAuditoria.Agregar(
                new AuditoriaEntidad
                {
                    UsuarioId = usuarioId,
                    Entidad = "Clase",
                    EntidadId = id,
                    Accion =
                        $"Eliminó clase Id {id} del grupo Id {grupoId}, día {diaSemana}, horario {horaInicio}-{horaFin}",
                    Fecha = DateTime.UtcNow
                });
        }
    }
}