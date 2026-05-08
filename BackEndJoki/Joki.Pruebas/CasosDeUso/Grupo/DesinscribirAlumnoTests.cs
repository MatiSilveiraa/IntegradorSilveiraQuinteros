using Joki.LogicaAplicacion.CasosDeUso.Grupo;

using Joki.LogicaNegocio.Entidades;
using Joki.LogicaNegocio.Enums;
using Joki.LogicaNegocio.Excepciones;
using Joki.LogicaNegocio.InterfacesRepositorio;
using Joki.LogicaNegocio.ValueObjects;

using Moq;

using ClaseEntidad = Joki.LogicaNegocio.Entidades.Clase;
using GrupoEntidad = Joki.LogicaNegocio.Entidades.Grupo;

namespace Joki.Pruebas.CasosDeUso.Clases
{
    public class DesinscribirAlumnoTests
    {
        [Fact]
        public void Ejecutar_LanzaExcepcion_CuandoAlumnoNoEstaInscripto()
        {
            var mockRepoInscripcion =
                new Mock<IRepositorioInscripcion>();

            var mockRepoListaEspera =
                new Mock<IRepositorioListaEspera>();

            var mockRepoAlumno =
                new Mock<IRepositorioAlumno>();

            var mockRepoClase =
                new Mock<IRepositorioClase>();

            var mockServicioEmail =
                new Mock<IServicioEmail>();

            mockRepoInscripcion
                .Setup(r => r.Existe(1, 1))
                .Returns(false);

            var casoUso =
                new DesinscribirAlumno(
                    mockRepoInscripcion.Object,
                    mockRepoListaEspera.Object,
                    mockRepoAlumno.Object,
                    mockRepoClase.Object,
                    mockServicioEmail.Object
                );

            var ex =
                Assert.Throws<LogicaNegocioException>(
                    () => casoUso.Ejecutar(1, 1));

            Assert.Equal(
                "El alumno no está inscripto en esta clase",
                ex.Message);
        }

        [Fact]
        public void Ejecutar_RemueveInscripcionYNoHaceNadaMas_CuandoListaEsperaEstaVacia()
        {
            var mockRepoInscripcion =
                new Mock<IRepositorioInscripcion>();

            var mockRepoListaEspera =
                new Mock<IRepositorioListaEspera>();

            var mockRepoAlumno =
                new Mock<IRepositorioAlumno>();

            var mockRepoClase =
                new Mock<IRepositorioClase>();

            var mockServicioEmail =
                new Mock<IServicioEmail>();

            mockRepoInscripcion
                .Setup(r => r.Existe(1, 1))
                .Returns(true);

            mockRepoListaEspera
                .Setup(r => r.ObtenerAlumnosEnEspera(1))
                .Returns(new List<int>());

            var casoUso =
                new DesinscribirAlumno(
                    mockRepoInscripcion.Object,
                    mockRepoListaEspera.Object,
                    mockRepoAlumno.Object,
                    mockRepoClase.Object,
                    mockServicioEmail.Object
                );

            casoUso.Ejecutar(1, 1);

            mockRepoInscripcion.Verify(
                r => r.Remover(1, 1),
                Times.Once);

            mockRepoInscripcion.Verify(
                r => r.Agregar(It.IsAny<Inscripcion>()),
                Times.Never);

            mockServicioEmail.Verify(
                s => s.EnviarNotificacionInscripcion(
                    It.IsAny<string>(),
                    It.IsAny<string>()),
                Times.Never);
        }

        [Fact]
        public void Ejecutar_AvanzaListaEspera_CuandoListaTeniaAlumnos()
        {
            var mockRepoInscripcion =
                new Mock<IRepositorioInscripcion>();

            var mockRepoListaEspera =
                new Mock<IRepositorioListaEspera>();

            var mockRepoAlumno =
                new Mock<IRepositorioAlumno>();

            var mockRepoClase =
                new Mock<IRepositorioClase>();

            var mockServicioEmail =
                new Mock<IServicioEmail>();

            int alumnoSeleccionado = 1;

            int claseId = 1;

            int alumnoEnEspera = 2;

            mockRepoInscripcion
                .Setup(r =>
                    r.Existe(
                        alumnoSeleccionado,
                        claseId))
                .Returns(true);

            mockRepoListaEspera
                .Setup(r =>
                    r.ObtenerAlumnosEnEspera(
                        claseId))
                .Returns(new List<int>
                {
                    alumnoEnEspera,
                    3
                });

            var alumnoDb = new Alumno
            {
                UsuarioId = alumnoEnEspera,
                Email = new Email("test@test.com")
            };

            var claseDb = new ClaseEntidad
            {
                Id = claseId,

                Estado = EstadoClase.Programada,

                Grupo = new GrupoEntidad
                {
                    Nombre = "Running Avanzado"
                },

                CupoMaximo = 10,

                Inscripciones = new List<Inscripcion>()
            };

            mockRepoAlumno
                .Setup(r =>
                    r.ObtenerPorId(
                        alumnoEnEspera))
                .Returns(alumnoDb);

            mockRepoClase
                .Setup(r =>
                    r.ObtenerPorId(
                        claseId))
                .Returns(claseDb);

            var casoUso =
                new DesinscribirAlumno(
                    mockRepoInscripcion.Object,
                    mockRepoListaEspera.Object,
                    mockRepoAlumno.Object,
                    mockRepoClase.Object,
                    mockServicioEmail.Object
                );

            casoUso.Ejecutar(
                alumnoSeleccionado,
                claseId);

            mockRepoInscripcion.Verify(
                r => r.Remover(
                    alumnoSeleccionado,
                    claseId),
                Times.Once);

            mockRepoInscripcion.Verify(
                r => r.Agregar(
                    It.Is<Inscripcion>(i =>
                        i.AlumnoId == alumnoEnEspera &&
                        i.ClaseId == claseId)),
                Times.Once);

            mockRepoListaEspera.Verify(
                r => r.Remover(
                    alumnoEnEspera,
                    claseId),
                Times.Once);

            mockServicioEmail.Verify(
                s => s.EnviarNotificacionInscripcion(
                    "test@test.com",
                    "Running Avanzado"),
                Times.Once);
        }
    }
}