using Joki.LogicaAplicacion.CasosDeUso.Clase;
using Joki.LogicaNegocio.Entidades;
using Joki.LogicaNegocio.Enums;
using Joki.LogicaNegocio.InterfacesRepositorio;
using Joki.LogicaNegocio.ValueObjects;
using Moq;

namespace Joki.Pruebas.CasosDeUso.Clase
{
    public class ObtenerClasesInscriptoTests
    {
        [Fact]
        public void Ejecutar_DeberiaRetornarClasesDelAlumno()
        {
            var mockRepoInscripcion =
                new Mock<IRepositorioInscripcion>();

            var inscripciones = new List<Inscripcion>
            {
                new Inscripcion
                {
                    Id = 1,
                    AlumnoId = 5,
                    ClaseId = 1,
                    Clase = new Joki.LogicaNegocio.Entidades.Clase
                    {
                        Id = 1,
                        GrupoId = 2,
                        DiaSemana = DiaSemana.Lunes,
                        HoraInicio = new TimeSpan(8, 0, 0),
                        HoraFin = new TimeSpan(9, 0, 0),
                        Ubicacion = new Ubicacion
                        {
                            Latitud = -32.3701m,
                            Longitud = -54.1675m,
                            CodigoPostal = "37000"
                        },
                        RadioGeolocalizacion = 100,
                        EsFija = true,
                        FechaInicio = new DateTime(2026, 5, 10, 8, 0, 0),
                        FechaFin = new DateTime(2026, 12, 31, 9, 0, 0),
                        CupoMaximo = 20,
                        Estado = EstadoClase.Programada
                    }
                },
                new Inscripcion
                {
                    Id = 2,
                    AlumnoId = 5,
                    ClaseId = 2,
                    Clase = new Joki.LogicaNegocio.Entidades.Clase
                    {
                        Id = 2,
                        GrupoId = 2,
                        DiaSemana = DiaSemana.Miercoles,
                        HoraInicio = new TimeSpan(19, 0, 0),
                        HoraFin = new TimeSpan(20, 0, 0),
                        Ubicacion = new Ubicacion
                        {
                            Latitud = -32.3701m,
                            Longitud = -54.1675m,
                            CodigoPostal = "37000"
                        },
                        RadioGeolocalizacion = 100,
                        EsFija = true,
                        FechaInicio = new DateTime(2026, 5, 10, 19, 0, 0),
                        FechaFin = new DateTime(2026, 12, 31, 20, 0, 0),
                        CupoMaximo = 20,
                        Estado = EstadoClase.Programada
                    }
                }
            };

            mockRepoInscripcion
                .Setup(r => r.ObtenerPorAlumno(5))
                .Returns(inscripciones);

            var casoUso =
                new ObtenerClasesInscripto(
                    mockRepoInscripcion.Object);

            var resultado =
                casoUso.Ejecutar(5);

            Assert.NotNull(resultado);

            Assert.Equal(2, resultado.Count);

            Assert.Equal(1, resultado[0].Id);
            Assert.Equal("Lunes", resultado[0].DiaSemana);
            Assert.Equal(new TimeSpan(8, 0, 0), resultado[0].HoraInicio);
            Assert.Equal(new TimeSpan(9, 0, 0), resultado[0].HoraFin);

            Assert.Equal(2, resultado[1].Id);
            Assert.Equal("Miercoles", resultado[1].DiaSemana);

            mockRepoInscripcion.Verify(
                r => r.ObtenerPorAlumno(5),
                Times.Once);
        }

        [Fact]
        public void Ejecutar_DeberiaRetornarListaVacia_CuandoAlumnoNoTieneInscripciones()
        {
            var mockRepoInscripcion =
                new Mock<IRepositorioInscripcion>();

            mockRepoInscripcion
                .Setup(r => r.ObtenerPorAlumno(5))
                .Returns(new List<Inscripcion>());

            var casoUso =
                new ObtenerClasesInscripto(
                    mockRepoInscripcion.Object);

            var resultado =
                casoUso.Ejecutar(5);

            Assert.NotNull(resultado);

            Assert.Empty(resultado);

            mockRepoInscripcion.Verify(
                r => r.ObtenerPorAlumno(5),
                Times.Once);
        }
    }
}
