using Joki.LogicaAplicacion.CasosDeUso.Desafio;
using Joki.LogicaNegocio.Excepciones;
using Joki.LogicaNegocio.InterfacesRepositorio;
using Moq;
using Entidades = Joki.LogicaNegocio.Entidades;

namespace Joki.Pruebas.CasosDeUso.Desafio
{
    public class ParticiparDesafioTests
    {
        [Fact]
        public void Ejecutar_DeberiaRegistrarParticipacion_CuandoDatosSonValidos()
        {
            var repoDesafioMock = new Mock<IRepositorioDesafio>();
            var repoAlumnoMock = new Mock<IRepositorioAlumno>();
            var repoParticipacionMock = new Mock<IRepositorioParticipacionDesafio>();

            repoDesafioMock
                .Setup(r => r.ObtenerPorId(2))
                .Returns(new Entidades.Desafio
                {
                    Id = 2,
                    Titulo = "Desafío",
                    Activo = true,
                    FechaInicio = DateTime.Now.AddDays(-1),
                    FechaFin = DateTime.Now.AddDays(5)
                });

            repoAlumnoMock
                .Setup(r => r.ObtenerPorId(7))
                .Returns(new Entidades.Alumno
                {
                    UsuarioId = 7
                });

            repoParticipacionMock
                .Setup(r => r.Obtener(7, 2))
                .Returns((Entidades.ParticipacionDesafio?)null);

            var casoUso = new ParticiparDesafio(
                repoDesafioMock.Object,
                repoAlumnoMock.Object,
                repoParticipacionMock.Object);

            casoUso.Ejecutar(2, 7);

            repoParticipacionMock.Verify(r => r.Agregar(
                It.Is<Entidades.ParticipacionDesafio>(p =>
                    p.AlumnoId == 7 &&
                    p.DesafioId == 2 &&
                    p.Ganador == false &&
                    p.Resultado == "Participando"
                )), Times.Once);
        }

        [Fact]
        public void Ejecutar_DeberiaLanzarExcepcion_CuandoDesafioNoExiste()
        {
            var casoUso = new ParticiparDesafio(
                new Mock<IRepositorioDesafio>().Object,
                new Mock<IRepositorioAlumno>().Object,
                new Mock<IRepositorioParticipacionDesafio>().Object);

            Assert.Throws<LogicaNegocioException>(() =>
                casoUso.Ejecutar(99, 7));
        }

        [Fact]
        public void Ejecutar_DeberiaLanzarExcepcion_CuandoAlumnoYaParticipa()
        {
            var repoDesafioMock = new Mock<IRepositorioDesafio>();
            var repoAlumnoMock = new Mock<IRepositorioAlumno>();
            var repoParticipacionMock = new Mock<IRepositorioParticipacionDesafio>();

            repoDesafioMock
                .Setup(r => r.ObtenerPorId(2))
                .Returns(new Entidades.Desafio
                {
                    Id = 2,
                    Activo = true,
                    FechaInicio = DateTime.Now.AddDays(-1),
                    FechaFin = DateTime.Now.AddDays(5)
                });

            repoAlumnoMock
                .Setup(r => r.ObtenerPorId(7))
                .Returns(new Entidades.Alumno
                {
                    UsuarioId = 7
                });

            repoParticipacionMock
                .Setup(r => r.Obtener(7, 2))
                .Returns(new Entidades.ParticipacionDesafio
                {
                    AlumnoId = 7,
                    DesafioId = 2
                });

            var casoUso = new ParticiparDesafio(
                repoDesafioMock.Object,
                repoAlumnoMock.Object,
                repoParticipacionMock.Object);

            Assert.Throws<LogicaNegocioException>(() =>
                casoUso.Ejecutar(2, 7));
        }
    }
}