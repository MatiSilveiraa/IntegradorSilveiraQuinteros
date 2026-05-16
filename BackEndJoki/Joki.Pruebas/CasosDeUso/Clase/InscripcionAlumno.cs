using Moq;
using Joki.LogicaAplicacion.CasosDeUso.Grupo;
using Joki.LogicaNegocio.Entidades;
using Joki.LogicaNegocio.Enums;
using Joki.LogicaNegocio.Excepciones;
using Joki.LogicaNegocio.InterfacesRepositorio;

using ClaseEntidad = Joki.LogicaNegocio.Entidades.Clase;

namespace Joki.Pruebas.CasosDeUso.Clases
{
    public class InscribirAlumnoTests
    {
        private readonly Mock<IRepositorioClase> _repoClase = new();

        private readonly Mock<IRepositorioAlumno> _repoAlumno = new();

        private readonly Mock<IRepositorioInscripcion> _repoInscripcion = new();

        private readonly Mock<IRepositorioListaEspera> _repoListaEspera = new();

        private InscribirAlumno CrearCU()
        {
            return new InscribirAlumno(
                _repoClase.Object,
                _repoAlumno.Object,
                _repoInscripcion.Object,
                _repoListaEspera.Object
            );
        }

        [Fact]
        public void AlumnoNoExiste_LanzaException()
        {
            _repoAlumno
                .Setup(r => r.ObtenerPorId(1))
                .Returns((Alumno)null);

            var cu = CrearCU();

            var ex =
                Assert.Throws<LogicaNegocioException>(
                    () => cu.Ejecutar(1, 1));

            Assert.Equal(
                "Alumno no existe",
                ex.Message);
        }

        [Fact]
        public void AlumnoInactivo_LanzaException()
        {
            var alumno = new Alumno
            {
                UsuarioId = 1,
                Estado = EstadoUsuario.INACTIVO
            };

            _repoAlumno
                .Setup(r => r.ObtenerPorId(1))
                .Returns(alumno);

            var cu = CrearCU();

            var ex =
                Assert.Throws<LogicaNegocioException>(
                    () => cu.Ejecutar(1, 1));

            Assert.Equal(
                "Alumno inactivo",
                ex.Message);
        }

        [Fact]
        public void AlumnoBloqueadoPorInasistencias_LanzaException()
        {
            var alumno = new Alumno
            {
                UsuarioId = 1,
                Estado = EstadoUsuario.ACTIVO,
                BloqueadoPorInasistencias = true
            };

            _repoAlumno
                .Setup(r => r.ObtenerPorId(1))
                .Returns(alumno);

            var cu = CrearCU();

            var ex =
                Assert.Throws<LogicaNegocioException>(
                    () => cu.Ejecutar(1, 1));

            Assert.Equal(
                "El alumno se encuentra bloqueado por inasistencias y no puede inscribirse a nuevas clases",
                ex.Message);

            _repoInscripcion.Verify(
                r => r.Agregar(
                    It.IsAny<Inscripcion>()),
                Times.Never);

            _repoListaEspera.Verify(
                r => r.Agregar(1, 1),
                Times.Never);
        }

        [Fact]
        public void ClaseNoExiste_LanzaException()
        {
            var alumno = new Alumno
            {
                UsuarioId = 1,
                Estado = EstadoUsuario.ACTIVO
            };

            _repoAlumno
                .Setup(r => r.ObtenerPorId(1))
                .Returns(alumno);

            _repoClase
                .Setup(r => r.ObtenerPorId(1))
                .Returns((ClaseEntidad)null);

            var cu = CrearCU();

            var ex =
                Assert.Throws<LogicaNegocioException>(
                    () => cu.Ejecutar(1, 1));

            Assert.Equal(
                "Clase no existe",
                ex.Message);
        }

        [Fact]
        public void ClaseNoDisponible_LanzaException()
        {
            var alumno = new Alumno
            {
                UsuarioId = 1,
                Estado = EstadoUsuario.ACTIVO
            };

            var clase = new ClaseEntidad
            {
                Id = 1,
                Estado = EstadoClase.Cancelada
            };

            _repoAlumno
                .Setup(r => r.ObtenerPorId(1))
                .Returns(alumno);

            _repoClase
                .Setup(r => r.ObtenerPorId(1))
                .Returns(clase);

            var cu = CrearCU();

            var ex =
                Assert.Throws<LogicaNegocioException>(
                    () => cu.Ejecutar(1, 1));

            Assert.Equal(
                "Clase no disponible",
                ex.Message);
        }

        [Fact]
        public void AlumnoYaInscripto_LanzaException()
        {
            var alumno = new Alumno
            {
                UsuarioId = 1,
                Estado = EstadoUsuario.ACTIVO
            };

            var clase = new ClaseEntidad
            {
                Id = 1,
                Estado = EstadoClase.Programada
            };

            _repoAlumno
                .Setup(r => r.ObtenerPorId(1))
                .Returns(alumno);

            _repoClase
                .Setup(r => r.ObtenerPorId(1))
                .Returns(clase);

            _repoInscripcion
                .Setup(r => r.Existe(1, 1))
                .Returns(true);

            var cu = CrearCU();

            var ex =
                Assert.Throws<LogicaNegocioException>(
                    () => cu.Ejecutar(1, 1));

            Assert.Equal(
                "El alumno ya está inscripto",
                ex.Message);
        }

        [Fact]
        public void SuperposicionHoraria_LanzaException()
        {
            var alumno = new Alumno
            {
                UsuarioId = 1,
                Estado = EstadoUsuario.ACTIVO
            };

            var clase = new ClaseEntidad
            {
                Id = 1,
                Estado = EstadoClase.Programada
            };

            _repoAlumno
                .Setup(r => r.ObtenerPorId(1))
                .Returns(alumno);

            _repoClase
                .Setup(r => r.ObtenerPorId(1))
                .Returns(clase);

            _repoInscripcion
                .Setup(r => r.Existe(1, 1))
                .Returns(false);

            _repoClase
                .Setup(r =>
                    r.TieneConflictoHorario(
                        1,
                        clase))
                .Returns(true);

            var cu = CrearCU();

            var ex =
                Assert.Throws<LogicaNegocioException>(
                    () => cu.Ejecutar(1, 1));

            Assert.Equal(
                "Superposición horaria",
                ex.Message);
        }

        [Fact]
        public void YaEnListaEspera_LanzaException()
        {
            var alumno = new Alumno
            {
                UsuarioId = 1,
                Estado = EstadoUsuario.ACTIVO
            };

            var clase = new ClaseEntidad
            {
                Id = 1,
                Estado = EstadoClase.Programada
            };

            _repoAlumno
                .Setup(r => r.ObtenerPorId(1))
                .Returns(alumno);

            _repoClase
                .Setup(r => r.ObtenerPorId(1))
                .Returns(clase);

            _repoInscripcion
                .Setup(r => r.Existe(1, 1))
                .Returns(false);

            _repoClase
                .Setup(r =>
                    r.TieneConflictoHorario(
                        1,
                        clase))
                .Returns(false);

            _repoListaEspera
                .Setup(r => r.Existe(1, 1))
                .Returns(true);

            var cu = CrearCU();

            var ex =
                Assert.Throws<LogicaNegocioException>(
                    () => cu.Ejecutar(1, 1));

            Assert.Equal(
                "Ya está en lista de espera",
                ex.Message);
        }

        [Fact]
        public void ClaseLlena_AgregaAListaEspera()
        {
            var alumno = new Alumno
            {
                UsuarioId = 1,
                Estado = EstadoUsuario.ACTIVO
            };

            var clase = new ClaseEntidad
            {
                Id = 1,

                Estado = EstadoClase.Programada,

                CupoMaximo = 1,

                Inscripciones =
                    new List<Inscripcion>
                    {
                        new Inscripcion()
                    }
            };

            _repoAlumno
                .Setup(r => r.ObtenerPorId(1))
                .Returns(alumno);

            _repoClase
                .Setup(r => r.ObtenerPorId(1))
                .Returns(clase);

            _repoInscripcion
                .Setup(r => r.Existe(1, 1))
                .Returns(false);

            _repoClase
                .Setup(r =>
                    r.TieneConflictoHorario(
                        1,
                        clase))
                .Returns(false);

            _repoListaEspera
                .Setup(r => r.Existe(1, 1))
                .Returns(false);

            var cu = CrearCU();

            var resultado =
                cu.Ejecutar(1, 1);

            Assert.Equal(
                "LISTA_ESPERA",
                resultado);

            _repoListaEspera.Verify(
                r => r.Agregar(1, 1),
                Times.Once);

            _repoInscripcion.Verify(
                r => r.Agregar(
                    It.IsAny<Inscripcion>()),
                Times.Never);
        }

        [Fact]
        public void InscripcionCorrecta_GuardaInscripcion()
        {
            var alumno = new Alumno
            {
                UsuarioId = 1,
                Estado = EstadoUsuario.ACTIVO
            };

            var clase = new ClaseEntidad
            {
                Id = 1,

                Estado = EstadoClase.Programada,

                CupoMaximo = 5,

                Inscripciones =
                    new List<Inscripcion>()
            };

            _repoAlumno
                .Setup(r => r.ObtenerPorId(1))
                .Returns(alumno);

            _repoClase
                .Setup(r => r.ObtenerPorId(1))
                .Returns(clase);

            _repoInscripcion
                .Setup(r => r.Existe(1, 1))
                .Returns(false);

            _repoClase
                .Setup(r =>
                    r.TieneConflictoHorario(
                        1,
                        clase))
                .Returns(false);

            _repoListaEspera
                .Setup(r => r.Existe(1, 1))
                .Returns(false);

            var cu = CrearCU();

            var resultado =
                cu.Ejecutar(1, 1);

            Assert.Equal(
                "INSCRIPTO",
                resultado);

            _repoInscripcion.Verify(
                r => r.Agregar(
                    It.IsAny<Inscripcion>()),
                Times.Once);

            _repoListaEspera.Verify(
                r => r.Agregar(1, 1),
                Times.Never);
        }
    }
}