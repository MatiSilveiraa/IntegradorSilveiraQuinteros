using Joki.CasoUsoCompartida.DTOs.Asistencia;
using Joki.CasoUsoCompartida.InterfacesCasosUso.Asistencia;
using Joki.LogicaNegocio.Entidades;
using Joki.LogicaNegocio.Excepciones;
using Joki.LogicaNegocio.InterfacesRepositorio;

namespace Joki.LogicaAplicacion.CasosDeUso.GestionAsistencias
{
    public class RegistrarAsistencia : IRegistrarAsistencia
    {
        private readonly IRepositorioAsistencia _repoAsistencia;

        private readonly IRepositorioClase _repoClase;

        private readonly IRepositorioAlumno _repoAlumno;

        public RegistrarAsistencia(
            IRepositorioAsistencia repoAsistencia,
            IRepositorioClase repoClase,
            IRepositorioAlumno repoAlumno)
        {
            _repoAsistencia = repoAsistencia;
            _repoClase = repoClase;
            _repoAlumno = repoAlumno;
        }

        public void Ejecutar(
            RegistrarAsistenciaRequest request,
            int usuarioId)
        {
            if (request == null)
            {
                throw new LogicaNegocioException(
                    "Los datos de asistencia no pueden ser nulos");
            }

            var alumno = _repoAlumno.ObtenerPorId(request.AlumnoId);

            if (alumno == null)
            {
                throw new LogicaNegocioException(
                    "Alumno no encontrado");
            }

            var clase = _repoClase.ObtenerPorId(request.ClaseId);

            if (clase == null)
            {
                throw new LogicaNegocioException(
                    "Clase no encontrada");
            }

            bool yaExiste = _repoAsistencia.ExisteAsistencia(
                request.AlumnoId,
                request.ClaseId,
                DateTime.Now.Date);

            if (yaExiste)
            {
                throw new LogicaNegocioException(
                    "La asistencia ya fue registrada");
            }

            Asistencia asistencia = new Asistencia
            {
                AlumnoId = request.AlumnoId,
                ClaseId = request.ClaseId,
                Presente = request.Presente,
                Fecha = DateTime.Now.Date,
                FechaRegistro = DateTime.Now,
                RegistradoPorId = usuarioId
            };

            _repoAsistencia.Agregar(asistencia);

            if (!request.Presente)
            {
                var ultimasAsistencias =
                    _repoAsistencia.ObtenerUltimasAsistencias(
                        request.AlumnoId,
                        5);

                bool todasSonFaltas =
                    ultimasAsistencias.Count == 5 &&
                    ultimasAsistencias.All(a => !a.Presente);

                if (todasSonFaltas)
                {
                    alumno.BloqueadoPorInasistencias = true;

                    _repoAlumno.Modificar(alumno);
                }
            }
        }
    }
}
