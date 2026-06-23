using Joki.CasoUsoCompartida.DTOs.Desafio;
using Joki.CasoUsoCompartida.InterfacesCasosUso.Desafio;
using Joki.LogicaNegocio.Enums;
using Joki.LogicaNegocio.Excepciones;
using Joki.LogicaNegocio.InterfacesRepositorio;
using Entidades = Joki.LogicaNegocio.Entidades;
using AuditoriaEntidad = Joki.LogicaNegocio.Entidades.Auditoria;

namespace Joki.LogicaAplicacion.CasosDeUso.Desafio
{
    public class AsignarGanadoresDesafio :
        IAsignarGanadoresDesafio
    {
        private readonly IRepositorioDesafio _repositorioDesafio;
        private readonly IRepositorioAlumno _repositorioAlumno;
        private readonly IRepositorioParticipacionDesafio _repositorioParticipacion;
        private readonly IRepositorioRecompensa _repositorioRecompensa;
        private readonly IRepositorioBeneficio _repositorioBeneficio;
        private readonly IRepositorioNotificacion _repositorioNotificacion;
        private readonly IRepositorioAuditoria _repositorioAuditoria;

        public AsignarGanadoresDesafio(
            IRepositorioDesafio repositorioDesafio,
            IRepositorioAlumno repositorioAlumno,
            IRepositorioParticipacionDesafio repositorioParticipacion,
            IRepositorioRecompensa repositorioRecompensa,
            IRepositorioBeneficio repositorioBeneficio,
            IRepositorioNotificacion repositorioNotificacion,
            IRepositorioAuditoria repositorioAuditoria)
        {
            _repositorioDesafio = repositorioDesafio;
            _repositorioAlumno = repositorioAlumno;
            _repositorioParticipacion = repositorioParticipacion;
            _repositorioRecompensa = repositorioRecompensa;
            _repositorioBeneficio = repositorioBeneficio;
            _repositorioNotificacion = repositorioNotificacion;
            _repositorioAuditoria = repositorioAuditoria;
        }

        public void Ejecutar(
            AsignarGanadoresRequest request,
            int usuarioId)
        {
            var desafio =
                _repositorioDesafio.ObtenerPorId(
                    request.DesafioId);

            if (desafio == null || !desafio.Activo)
            {
                throw new LogicaNegocioException(
                    "No existe el desafío");
            }

            if (request.AlumnosIds == null ||
                !request.AlumnosIds.Any())
            {
                throw new LogicaNegocioException(
                    "Debe seleccionar al menos un alumno ganador");
            }

            var recompensas =
                _repositorioRecompensa
                    .ObtenerPorDesafio(request.DesafioId)
                    .ToList();

            if (!recompensas.Any())
            {
                throw new LogicaNegocioException(
                    "El desafío no tiene recompensas configuradas");
            }

            foreach (int alumnoId in request.AlumnosIds)
            {
                var alumno =
                    _repositorioAlumno.ObtenerPorId(alumnoId);

                if (alumno == null)
                {
                    throw new LogicaNegocioException(
                        "Uno de los alumnos seleccionados no existe");
                }

                var participacion =
                    _repositorioParticipacion.Obtener(
                        alumnoId,
                        request.DesafioId);

                if (participacion == null)
                {
                    throw new LogicaNegocioException(
                        "El alumno no participa en el desafío");
                }

                participacion.Ganador = true;
                participacion.Resultado =
                    "Ganador asignado manualmente";

                _repositorioParticipacion.Modificar(
                    participacion);

                _repositorioNotificacion.Agregar(
                    new Entidades.Notificacion
                    {
                        UsuarioId = alumnoId,
                        Titulo = "Ganaste un desafío",
                        Mensaje =
                            $"Felicitaciones, fuiste seleccionado como ganador del desafío {desafio.Titulo}.",
                        Tipo = TipoNotificacion.Desafio,
                        UrlDestino = $"/desafios/{desafio.Id}",
                        EntidadReferencia = "Desafio",
                        EntidadReferenciaId = desafio.Id
                    });

                foreach (var recompensa in recompensas)
                {
                    var beneficio =
                        new Entidades.Beneficio
                        {
                            AlumnoId = alumnoId,
                            RecompensaId = recompensa.Id,
                            DescuentoId = recompensa.DescuentoId,
                            CuotaGratis = recompensa.OtorgaCuotaGratis,
                            DescripcionBeneficio = recompensa.Descripcion,
                            MesesDuracion = 1,
                            MesesAplicados = 0,
                            Estado = EstadoBeneficio.PENDIENTE
                        };

                    if (recompensa.Descuento != null)
                    {
                        beneficio.MesesDuracion =
                            recompensa.Descuento.MesesDuracion;
                    }

                    _repositorioBeneficio.Agregar(
                        beneficio);

                    _repositorioNotificacion.Agregar(
                        new Entidades.Notificacion
                        {
                            UsuarioId = alumnoId,
                            Titulo = "Nuevo beneficio disponible",
                            Mensaje =
                                $"Recibiste un beneficio: {beneficio.DescripcionBeneficio}.",
                            Tipo = TipoNotificacion.Beneficio,
                            UrlDestino = "/beneficios",
                            EntidadReferencia = "Beneficio",
                            EntidadReferenciaId = beneficio.Id
                        });
                }
            }

            _repositorioAuditoria.Agregar(
                new AuditoriaEntidad
                {
                    UsuarioId = usuarioId,
                    Entidad = "Desafio",
                    EntidadId = desafio.Id,
                    Accion =
                        $"Asignó {request.AlumnosIds.Count()} ganador/es al desafío {desafio.Titulo}",
                    Fecha = DateTime.UtcNow
                });
        }
    }
}