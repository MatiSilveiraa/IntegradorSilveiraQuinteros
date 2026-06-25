using Joki.CasoUsoCompartida.DTOs.Clase;
using Joki.CasoUsoCompartida.InterfacesCasosUso.Clase;
using Joki.LogicaNegocio.Enums;
using Joki.LogicaNegocio.Excepciones;
using Joki.LogicaNegocio.InterfacesRepositorio;
using AuditoriaEntidad = Joki.LogicaNegocio.Entidades.Auditoria;
using NotificacionEntidad = Joki.LogicaNegocio.Entidades.Notificacion;

namespace Joki.LogicaAplicacion.CasosDeUso.Clase
{
    public class CambiarEstadoClase : ICambiarEstadoClase
    {
        private readonly IRepositorioClase _repositorioClase;
        private readonly IRepositorioInscripcion _repositorioInscripcion;
        private readonly IRepositorioNotificacion _repositorioNotificacion;
        private readonly IRepositorioAuditoria _repositorioAuditoria;

        public CambiarEstadoClase(
            IRepositorioClase repositorioClase,
            IRepositorioInscripcion repositorioInscripcion,
            IRepositorioNotificacion repositorioNotificacion,
            IRepositorioAuditoria repositorioAuditoria)
        {
            _repositorioClase = repositorioClase;
            _repositorioInscripcion = repositorioInscripcion;
            _repositorioNotificacion = repositorioNotificacion;
            _repositorioAuditoria = repositorioAuditoria;
        }

        public void Ejecutar(
            int claseId,
            CambiarEstadoClaseRequest request,
            int usuarioId)
        {
            var clase =
                _repositorioClase.ObtenerPorId(claseId);

            if (clase == null)
            {
                throw new LogicaNegocioException(
                    "La clase no existe");
            }

            var estadoAnterior =
                clase.Estado;

            if (estadoAnterior == request.Estado)
            {
                throw new LogicaNegocioException(
                    "La clase ya se encuentra en ese estado");
            }

            clase.Estado =
                request.Estado;

            _repositorioClase.Actualizar(clase);

            if (request.Estado != EstadoClase.Realizada)
            {
                var inscripciones =
                    _repositorioInscripcion.ObtenerPorClase(claseId);

                foreach (var inscripcion in inscripciones)
                {
                    _repositorioNotificacion.Agregar(
                        new NotificacionEntidad
                        {
                            UsuarioId = inscripcion.AlumnoId,
                            Titulo = ObtenerTitulo(request.Estado),
                            Mensaje = ObtenerMensaje(
                                request.Estado,
                                clase.DiaSemana.ToString(),
                                clase.HoraInicio,
                                clase.HoraFin,
                                request.Motivo),
                            Tipo = TipoNotificacion.Sistema,
                            UrlDestino = "/mis-clases",
                            EntidadReferencia = "Clase",
                            EntidadReferenciaId = clase.Id
                        });
                }
            }

            _repositorioAuditoria.Agregar(
                new AuditoriaEntidad
                {
                    UsuarioId = usuarioId,
                    Entidad = "Clase",
                    EntidadId = clase.Id,
                    Accion =
                        $"Cambió estado de clase Id {clase.Id}: {estadoAnterior} -> {request.Estado}. Motivo: {request.Motivo ?? "Sin motivo"}",
                    Fecha = DateTime.UtcNow
                });
        }

        private static string ObtenerTitulo(
            EstadoClase estado)
        {
            return estado switch
            {
                EstadoClase.Suspendida => "Clase suspendida",
                EstadoClase.Cancelada => "Clase cancelada",
                EstadoClase.Programada => "Clase programada",
                _ => "Cambio de estado de clase"
            };
        }

        private static string ObtenerMensaje(
            EstadoClase estado,
            string diaSemana,
            TimeSpan horaInicio,
            TimeSpan horaFin,
            string? motivo)
        {
            string accion = estado switch
            {
                EstadoClase.Suspendida => "fue suspendida",
                EstadoClase.Cancelada => "fue cancelada",
                EstadoClase.Programada => "fue programada nuevamente",
                _ => "cambió de estado"
            };

            string mensaje =
                $"La clase del {diaSemana} de {horaInicio} a {horaFin} {accion}.";

            if (!string.IsNullOrWhiteSpace(motivo))
            {
                mensaje += $" Motivo: {motivo}";
            }

            return mensaje;
        }
    }
}