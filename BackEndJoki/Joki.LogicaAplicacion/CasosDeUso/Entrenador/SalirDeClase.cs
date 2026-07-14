using Joki.CasoUsoCompartida
    .InterfacesCasosUso.Entrenador;
using Joki.LogicaNegocio.Excepciones;
using Joki.LogicaNegocio.InterfacesRepositorio;

using AuditoriaEntidad =
    Joki.LogicaNegocio.Entidades.Auditoria;

namespace Joki.LogicaAplicacion.CasosDeUso.Entrenador
{
    public class SalirDeClase :
        ISalirDeClase
    {
        private readonly IRepositorioClaseEntrenador
            _repositorioClaseEntrenador;

        private readonly IRepositorioClase
            _repositorioClase;

        private readonly IRepositorioAuditoria
            _repositorioAuditoria;

        public SalirDeClase(
            IRepositorioClaseEntrenador
                repositorioClaseEntrenador,
            IRepositorioClase repositorioClase,
            IRepositorioAuditoria repositorioAuditoria)
        {
            _repositorioClaseEntrenador =
                repositorioClaseEntrenador;

            _repositorioClase =
                repositorioClase;

            _repositorioAuditoria =
                repositorioAuditoria;
        }

        public void Ejecutar(
    int claseId,
    int entrenadorId)
        {
            var clase =
                _repositorioClase.ObtenerPorId(
                    claseId);

            if (clase == null)
            {
                throw new LogicaNegocioException(
                    "La clase no existe");
            }

            var relacion =
                _repositorioClaseEntrenador.Obtener(
                    claseId,
                    entrenadorId);

            if (relacion == null)
            {
                throw new LogicaNegocioException(
                    "No estás asociado a esta clase");
            }

            var relaciones =
                _repositorioClaseEntrenador
                    .ObtenerPorClase(
                        claseId);

            if (relaciones.Count == 1)
            {
                throw new LogicaNegocioException(
                    "No puedes abandonar la clase porque eres el único entrenador asignado. Asigna otro entrenador antes de salir.");
            }

            bool eraPrincipal =
                relacion.EsPrincipal;

            _repositorioClaseEntrenador.Eliminar(
                relacion);

            if (eraPrincipal)
            {
                var nuevoPrincipal =
                    relaciones
                        .Where(r =>
                            r.EntrenadorId != entrenadorId)
                        .OrderBy(r =>
                            r.FechaAsignacion)
                        .First();

                nuevoPrincipal.EsPrincipal = true;

                _repositorioClaseEntrenador.Modificar(
                    nuevoPrincipal);

                _repositorioAuditoria.Agregar(
                    new AuditoriaEntidad
                    {
                        UsuarioId = entrenadorId,

                        Entidad = "ClaseEntrenador",

                        EntidadId = claseId,

                        Accion =
                            $"El entrenador Id {nuevoPrincipal.EntrenadorId} pasó a ser entrenador principal de la clase Id {claseId}",

                        Fecha = DateTime.UtcNow
                    });
            }

            _repositorioAuditoria.Agregar(
                new AuditoriaEntidad
                {
                    UsuarioId = entrenadorId,

                    Entidad = "ClaseEntrenador",

                    EntidadId = claseId,

                    Accion =
                        $"El entrenador Id {entrenadorId} abandonó la clase Id {claseId}",

                    Fecha = DateTime.UtcNow
                });
        }
    }
}