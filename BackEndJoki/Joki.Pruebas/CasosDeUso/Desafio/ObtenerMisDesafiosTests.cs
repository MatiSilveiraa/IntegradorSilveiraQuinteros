using Joki.LogicaAplicacion.CasosDeUso.Desafio;
using Joki.LogicaNegocio.InterfacesRepositorio;
using Moq;
using Entidades = Joki.LogicaNegocio.Entidades;

namespace Joki.Pruebas.CasosDeUso.Desafio
{
    public class ObtenerMisDesafiosTests
    {
        [Fact]
        public void Ejecutar_DeberiaRetornarDesafioParticipado()
        {
            var repoDesafioMock =
                new Mock<IRepositorioDesafio>();

            var repoParticipacionMock =
                new Mock<IRepositorioParticipacionDesafio>();

            repoDesafioMock
                .Setup(r => r.ObtenerActivos())
                .Returns(new List<Entidades.Desafio>
                {
                    new Entidades.Desafio
                    {
                        Id = 2,
                        Titulo = "Desafío Invierno",
                        Descripcion = "Descripción",
                        FechaInicio = DateTime.Now,
                        FechaFin = DateTime.Now.AddDays(10),
                        Activo = true
                    }
                });

            repoParticipacionMock
                .Setup(r => r.ObtenerPorAlumno(7))
                .Returns(new List<Entidades.ParticipacionDesafio>
                {
                    new Entidades.ParticipacionDesafio
                    {
                        AlumnoId = 7,
                        DesafioId = 2,
                        Ganador = false,
                        Resultado = "Participando"
                    }
                });

            var casoUso =
                new ObtenerMisDesafios(
                    repoDesafioMock.Object,
                    repoParticipacionMock.Object);

            var resultado =
                casoUso.Ejecutar(7).ToList();

            Assert.Single(resultado);

            Assert.True(resultado[0].Participa);
            Assert.False(resultado[0].Ganador);
        }

        [Fact]
        public void Ejecutar_DeberiaRetornarGanadorCuandoCorresponde()
        {
            var repoDesafioMock =
                new Mock<IRepositorioDesafio>();

            var repoParticipacionMock =
                new Mock<IRepositorioParticipacionDesafio>();

            repoDesafioMock
                .Setup(r => r.ObtenerActivos())
                .Returns(new List<Entidades.Desafio>
                {
                    new Entidades.Desafio
                    {
                        Id = 2,
                        Titulo = "Desafío",
                        Activo = true
                    }
                });

            repoParticipacionMock
                .Setup(r => r.ObtenerPorAlumno(7))
                .Returns(new List<Entidades.ParticipacionDesafio>
                {
                    new Entidades.ParticipacionDesafio
                    {
                        AlumnoId = 7,
                        DesafioId = 2,
                        Ganador = true,
                        Resultado =
                            "Ganador asignado manualmente"
                    }
                });

            var casoUso =
                new ObtenerMisDesafios(
                    repoDesafioMock.Object,
                    repoParticipacionMock.Object);

            var resultado =
                casoUso.Ejecutar(7).First();

            Assert.True(resultado.Ganador);

            Assert.Equal(
                "Ganador asignado manualmente",
                resultado.Resultado);
        }
    }
}