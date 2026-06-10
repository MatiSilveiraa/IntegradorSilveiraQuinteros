using Joki.CasoUsoCompartida.DTOs.Desafio;
using Joki.CasoUsoCompartida.InterfacesCasosUso.Desafio;
using Joki.LogicaNegocio.Entidades;
using Joki.LogicaNegocio.Enums;
using Joki.LogicaNegocio.Excepciones;
using Joki.LogicaNegocio.InterfacesRepositorio;

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

        public AsignarGanadoresDesafio(
            IRepositorioDesafio repositorioDesafio,
            IRepositorioAlumno repositorioAlumno,
            IRepositorioParticipacionDesafio repositorioParticipacion,
            IRepositorioRecompensa repositorioRecompensa,
            IRepositorioBeneficio repositorioBeneficio)
        {
            _repositorioDesafio = repositorioDesafio;
            _repositorioAlumno = repositorioAlumno;
            _repositorioParticipacion = repositorioParticipacion;
            _repositorioRecompensa = repositorioRecompensa;
            _repositorioBeneficio = repositorioBeneficio;
        }

        public void Ejecutar(
            AsignarGanadoresRequest request)
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
                    participacion =
                        new ParticipacionDesafio
                        {
                            AlumnoId = alumnoId,
                            DesafioId = request.DesafioId,
                            Resultado = "Ganador asignado manualmente",
                            Ganador = true
                        };

                    _repositorioParticipacion.Agregar(
                        participacion);
                }
                else
                {
                    participacion.Ganador = true;
                    participacion.Resultado =
                        "Ganador asignado manualmente";

                    _repositorioParticipacion.Modificar(
                        participacion);
                }

                foreach (var recompensa in recompensas)
                {
                    var beneficio =
                        new Beneficio
                        {
                            AlumnoId = alumnoId,
                            RecompensaId = recompensa.Id,
                            DescuentoId = recompensa.DescuentoId,
                            CuotaGratis =
                                recompensa.OtorgaCuotaGratis,
                            DescripcionBeneficio =
                                recompensa.Descripcion,
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
                }
            }
        }
    }
}