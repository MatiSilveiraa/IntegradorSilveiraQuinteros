using Moq;

using Joki.CasoUsoCompartida.DTOs.Clase;

using Joki.LogicaAplicacion.CasosDeUso.Clase;

using Joki.LogicaNegocio.Enums;
using Joki.LogicaNegocio.Excepciones;
using Joki.LogicaNegocio.InterfacesRepositorio;

using ClaseEntidad = Joki.LogicaNegocio.Entidades.Clase;
using GrupoEntidad = Joki.LogicaNegocio.Entidades.Grupo;

namespace Joki.Pruebas.CasosDeUso.Clases
{
    public class ClaseTests
    {
        [Fact]
        public void CrearClase_DeberiaCrearClase_CuandoDatosSonValidos()
        {
            var mockRepoClase = new Mock<IRepositorioClase>();
            var mockRepoGrupo = new Mock<IRepositorioGrupo>();
            var mockRepoAuditoria = new Mock<IRepositorioAuditoria>();

            var grupo = new GrupoEntidad
            {
                Id = 1,
                Nombre = "Running",
                Estado = EstadoGrupo.ACTIVO
            };

            var request = new CrearClaseRequest
            {
                GrupoId = 1,
                DiaSemana = DiaSemana.Lunes,
                HoraInicio = new TimeSpan(19, 0, 0),
                HoraFin = new TimeSpan(20, 0, 0),
                Latitud = -34.90m,
                Longitud = -56.16m,
                CodigoPostal = "11000",
                RadioGeolocalizacion = 100,
                EsFija = true,
                FechaInicio = DateTime.Now,
                FechaFin = DateTime.Now.AddMonths(3),
                CupoMaximo = 20
            };

            mockRepoGrupo
                .Setup(r => r.ObtenerPorId(1))
                .Returns(grupo);

            mockRepoClase
                .Setup(r => r.Agregar(It.IsAny<ClaseEntidad>()))
                .Returns((ClaseEntidad clase) =>
                {
                    clase.Id = 1;
                    return clase;
                });

            var casoUso =
                new CrearClase(
                    mockRepoClase.Object,
                    mockRepoGrupo.Object,
                    mockRepoAuditoria.Object);

            var resultado =
                casoUso.Ejecutar(request, 99);

            Assert.NotNull(resultado);
            Assert.Equal(1, resultado.Id);
            Assert.Equal("Lunes", resultado.DiaSemana);
            Assert.Equal(new TimeSpan(19, 0, 0), resultado.HoraInicio);
            Assert.Equal(new TimeSpan(20, 0, 0), resultado.HoraFin);
            Assert.Equal(20, resultado.CupoMaximo);

            mockRepoClase.Verify(r =>
                r.Agregar(It.IsAny<ClaseEntidad>()),
                Times.Once);

            mockRepoAuditoria.Verify(r =>
                r.Agregar(It.IsAny<Joki.LogicaNegocio.Entidades.Auditoria>()),
                Times.Once);
        }

        [Fact]
        public void CrearClase_DeberiaLanzarExcepcion_CuandoGrupoNoExiste()
        {
            var mockRepoClase = new Mock<IRepositorioClase>();
            var mockRepoGrupo = new Mock<IRepositorioGrupo>();
            var mockRepoAuditoria = new Mock<IRepositorioAuditoria>();

            var request = new CrearClaseRequest
            {
                GrupoId = 1,
                DiaSemana = DiaSemana.Lunes,
                HoraInicio = new TimeSpan(19, 0, 0),
                HoraFin = new TimeSpan(20, 0, 0),
                CupoMaximo = 20
            };

            mockRepoGrupo
                .Setup(r => r.ObtenerPorId(1))
                .Returns((GrupoEntidad)null);

            var casoUso =
                new CrearClase(
                    mockRepoClase.Object,
                    mockRepoGrupo.Object,
                    mockRepoAuditoria.Object);

            var ex =
                Assert.Throws<LogicaNegocioException>(
                    () => casoUso.Ejecutar(request, 99));

            Assert.Equal("El grupo no existe", ex.Message);

            mockRepoAuditoria.Verify(r =>
                r.Agregar(It.IsAny<Joki.LogicaNegocio.Entidades.Auditoria>()),
                Times.Never);
        }

        [Fact]
        public void ObtenerClase_DeberiaRetornarClase_CuandoExiste()
        {
            var mockRepoClase = new Mock<IRepositorioClase>();

            var clase = new ClaseEntidad
            {
                Id = 1,
                DiaSemana = DiaSemana.Martes,
                HoraInicio = new TimeSpan(18, 0, 0),
                HoraFin = new TimeSpan(19, 0, 0),
                Estado = EstadoClase.Programada,
                CupoMaximo = 15
            };

            mockRepoClase
                .Setup(r => r.ObtenerPorId(1))
                .Returns(clase);

            var casoUso =
                new ObtenerClase(
                    mockRepoClase.Object);

            var resultado =
                casoUso.Ejecutar(1);

            Assert.NotNull(resultado);
            Assert.Equal(1, resultado.Id);
            Assert.Equal("Martes", resultado.DiaSemana);
            Assert.Equal(15, resultado.CupoMaximo);
        }

        [Fact]
        public void ObtenerClase_DeberiaLanzarExcepcion_CuandoNoExiste()
        {
            var mockRepoClase = new Mock<IRepositorioClase>();

            mockRepoClase
                .Setup(r => r.ObtenerPorId(1))
                .Returns((ClaseEntidad)null);

            var casoUso =
                new ObtenerClase(
                    mockRepoClase.Object);

            var ex =
                Assert.Throws<LogicaNegocioException>(
                    () => casoUso.Ejecutar(1));

            Assert.Equal("La clase no existe", ex.Message);
        }

        [Fact]
        public void EliminarClase_DeberiaEliminarClase_CuandoExiste()
        {
            var mockRepoClase = new Mock<IRepositorioClase>();
            var mockRepoAuditoria = new Mock<IRepositorioAuditoria>();

            var clase = new ClaseEntidad
            {
                Id = 1,
                GrupoId = 1,
                DiaSemana = DiaSemana.Lunes,
                HoraInicio = new TimeSpan(9, 0, 0),
                HoraFin = new TimeSpan(10, 0, 0)
            };

            mockRepoClase
                .Setup(r => r.ObtenerPorId(1))
                .Returns(clase);

            var casoUso =
                new EliminarClase(
                    mockRepoClase.Object,
                    mockRepoAuditoria.Object);

            casoUso.Ejecutar(1, 99);

            mockRepoClase.Verify(r =>
                r.Eliminar(1),
                Times.Once);

            mockRepoAuditoria.Verify(r =>
                r.Agregar(It.IsAny<Joki.LogicaNegocio.Entidades.Auditoria>()),
                Times.Once);
        }

        [Fact]
        public void EliminarClase_DeberiaLanzarExcepcion_CuandoNoExiste()
        {
            var mockRepoClase = new Mock<IRepositorioClase>();
            var mockRepoAuditoria = new Mock<IRepositorioAuditoria>();

            mockRepoClase
                .Setup(r => r.ObtenerPorId(1))
                .Returns((ClaseEntidad)null);

            var casoUso =
                new EliminarClase(
                    mockRepoClase.Object,
                    mockRepoAuditoria.Object);

            var ex =
                Assert.Throws<LogicaNegocioException>(
                    () => casoUso.Ejecutar(1, 99));

            Assert.Equal("La clase no existe", ex.Message);

            mockRepoAuditoria.Verify(r =>
                r.Agregar(It.IsAny<Joki.LogicaNegocio.Entidades.Auditoria>()),
                Times.Never);
        }

        [Fact]
        public void ObtenerClases_DeberiaRetornarLista()
        {
            var mockRepoClase = new Mock<IRepositorioClase>();

            var clases = new List<ClaseEntidad>
            {
                new ClaseEntidad
                {
                    Id = 1,
                    DiaSemana = DiaSemana.Lunes,
                    Estado = EstadoClase.Programada,
                    CupoMaximo = 20
                },

                new ClaseEntidad
                {
                    Id = 2,
                    DiaSemana = DiaSemana.Miercoles,
                    Estado = EstadoClase.Programada,
                    CupoMaximo = 15
                }
            };

            mockRepoClase
                .Setup(r => r.ObtenerTodos())
                .Returns(clases);

            var casoUso =
                new ObtenerClases(
                    mockRepoClase.Object);

            var resultado =
                casoUso.Ejecutar().ToList();

            Assert.Equal(2, resultado.Count);
            Assert.Equal("Lunes", resultado[0].DiaSemana);
            Assert.Equal("Miercoles", resultado[1].DiaSemana);
        }
    }
}