using Joki.CasoUsoCompartida.DTOs.Clase;
using Joki.CasoUsoCompartida.DTOs.Grupo;
using Joki.LogicaAplicacion.CasosDeUso.Grupo;
using Joki.LogicaNegocio.Enums;
using Joki.LogicaNegocio.Excepciones;
using Joki.LogicaNegocio.InterfacesRepositorio;
using Moq;
using GrupoEntidad = Joki.LogicaNegocio.Entidades.Grupo;

namespace Joki.Pruebas.CasosDeUso.Grupos
{
    public class GrupoTests
    {
        [Fact]
        public void CrearGrupo_DeberiaCrearGrupo_CuandoDatosSonValidos()
        {
            var mockRepo = new Mock<IRepositorioGrupo>();
            var mockRepoAuditoria = new Mock<IRepositorioAuditoria>();

            var request = new CrearGrupoRequest
            {
                Nombre = "Running",
                Nivel = "Intermedio",
                EntrenadorId = 1,
                Clases = new List<CrearClaseRequest>
                {
                    new CrearClaseRequest
                    {
                        DiaSemana = DiaSemana.Lunes,
                        HoraInicio = new TimeSpan(9, 0, 0),
                        HoraFin = new TimeSpan(10, 0, 0),
                        CupoMaximo = 20,
                        Latitud = -34.90m,
                        Longitud = -56.16m,
                        CodigoPostal = "11000",
                        RadioGeolocalizacion = 100,
                        EsFija = true,
                        FechaInicio = DateTime.UtcNow,
                        FechaFin = DateTime.UtcNow.AddMonths(1)
                    }
                }
            };

            mockRepo.Setup(r =>
                r.Agregar(It.IsAny<GrupoEntidad>()))
                .Returns((GrupoEntidad grupo) =>
                {
                    grupo.Id = 1;
                    return grupo;
                });

            var casoUso =
                new CrearGrupo(
                    mockRepo.Object,
                    mockRepoAuditoria.Object);

            var resultado =
                casoUso.Ejecutar(request, 99);

            Assert.NotNull(resultado);
            Assert.Equal(1, resultado.Id);
            Assert.Equal("Running", resultado.Nombre);
            Assert.Equal("Intermedio", resultado.Nivel);
            Assert.Equal("ACTIVO", resultado.Estado);
            Assert.Equal(1, resultado.EntrenadorId);

            mockRepo.Verify(r =>
                r.Agregar(It.IsAny<GrupoEntidad>()),
                Times.Once);

            mockRepoAuditoria.Verify(r =>
                r.Agregar(It.IsAny<Joki.LogicaNegocio.Entidades.Auditoria>()),
                Times.Once);
        }

        [Fact]
        public void ObtenerGrupos_DeberiaRetornarTodosLosGrupos()
        {
            var mockRepo = new Mock<IRepositorioGrupo>();

            var grupos = new List<GrupoEntidad>
            {
                new GrupoEntidad
                {
                    Id = 1,
                    Nombre = "Running",
                    Nivel = "Inicial",
                    Estado = EstadoGrupo.ACTIVO,
                    EntrenadorId = 1
                },
                new GrupoEntidad
                {
                    Id = 2,
                    Nombre = "Funcional",
                    Nivel = "Avanzado",
                    Estado = EstadoGrupo.ACTIVO,
                    EntrenadorId = 2
                }
            };

            mockRepo.Setup(r =>
                r.ObtenerTodos())
                .Returns(grupos);

            var casoUso =
                new ObtenerGrupos(mockRepo.Object);

            var resultado =
                casoUso.Ejecutar().ToList();

            Assert.NotNull(resultado);
            Assert.Equal(2, resultado.Count);
            Assert.Equal("Running", resultado[0].Nombre);
            Assert.Equal("Funcional", resultado[1].Nombre);

            mockRepo.Verify(r =>
                r.ObtenerTodos(),
                Times.Once);
        }

        [Fact]
        public void ObtenerGrupos_DeberiaRetornarListaVacia_CuandoNoHayGrupos()
        {
            var mockRepo = new Mock<IRepositorioGrupo>();

            mockRepo.Setup(r =>
                r.ObtenerTodos())
                .Returns(new List<GrupoEntidad>());

            var casoUso =
                new ObtenerGrupos(mockRepo.Object);

            var resultado =
                casoUso.Ejecutar().ToList();

            Assert.NotNull(resultado);
            Assert.Empty(resultado);

            mockRepo.Verify(r =>
                r.ObtenerTodos(),
                Times.Once);
        }

        [Fact]
        public void ObtenerGrupoPorId_DeberiaRetornarGrupo_CuandoExiste()
        {
            var mockRepo = new Mock<IRepositorioGrupo>();

            var grupo = new GrupoEntidad
            {
                Id = 1,
                Nombre = "Running",
                Nivel = "Inicial",
                Estado = EstadoGrupo.ACTIVO,
                EntrenadorId = 1
            };

            mockRepo.Setup(r =>
                r.ObtenerPorId(1))
                .Returns(grupo);

            var casoUso =
                new ObtenerGrupoPorId(mockRepo.Object);

            var resultado =
                casoUso.Ejecutar(1);

            Assert.NotNull(resultado);
            Assert.Equal(1, resultado.Id);
            Assert.Equal("Running", resultado.Nombre);
            Assert.Equal("Inicial", resultado.Nivel);
            Assert.Equal(1, resultado.EntrenadorId);

            mockRepo.Verify(r =>
                r.ObtenerPorId(1),
                Times.Once);
        }

        [Fact]
        public void ObtenerGrupoPorId_DeberiaLanzarExcepcion_CuandoNoExiste()
        {
            var mockRepo = new Mock<IRepositorioGrupo>();

            mockRepo.Setup(r =>
                r.ObtenerPorId(99))
                .Returns((GrupoEntidad?)null);

            var casoUso =
                new ObtenerGrupoPorId(mockRepo.Object);

            var exception =
                Assert.Throws<LogicaNegocioException>(
                    () => casoUso.Ejecutar(99));

            Assert.Equal(
                "El grupo solicitado no existe.",
                exception.Message);

            mockRepo.Verify(r =>
                r.ObtenerPorId(99),
                Times.Once);
        }

        [Fact]
        public void EditarGrupo_DeberiaEditarGrupo_CuandoExiste()
        {
            var mockRepo = new Mock<IRepositorioGrupo>();
            var mockRepoAuditoria = new Mock<IRepositorioAuditoria>();

            var grupo = new GrupoEntidad
            {
                Id = 1,
                Nombre = "Running Viejo",
                Nivel = "Inicial",
                Estado = EstadoGrupo.ACTIVO,
                EntrenadorId = 1
            };

            var request = new EditarGrupoRequest
            {
                Nombre = "Running Editado",
                Nivel = "Avanzado",
                EntrenadorId = 2
            };

            mockRepo.Setup(r =>
                r.ObtenerPorId(1))
                .Returns(grupo);

            var casoUso =
                new EditarGrupo(
                    mockRepo.Object,
                    mockRepoAuditoria.Object);

            var resultado =
                casoUso.Ejecutar(1, request, 99);

            Assert.NotNull(resultado);
            Assert.Equal("Running Editado", resultado.Nombre);
            Assert.Equal("Avanzado", resultado.Nivel);
            Assert.Equal(2, resultado.EntrenadorId);

            mockRepo.Verify(r =>
                r.ObtenerPorId(1),
                Times.Once);

            mockRepo.Verify(r =>
                r.Actualizar(It.IsAny<GrupoEntidad>()),
                Times.Once);

            mockRepoAuditoria.Verify(r =>
                r.Agregar(It.IsAny<Joki.LogicaNegocio.Entidades.Auditoria>()),
                Times.Once);
        }

        [Fact]
        public void EditarGrupo_DeberiaLanzarExcepcion_CuandoNoExiste()
        {
            var mockRepo = new Mock<IRepositorioGrupo>();
            var mockRepoAuditoria = new Mock<IRepositorioAuditoria>();

            var request = new EditarGrupoRequest
            {
                Nombre = "Running Editado",
                Nivel = "Avanzado",
                EntrenadorId = 2
            };

            mockRepo.Setup(r =>
                r.ObtenerPorId(99))
                .Returns((GrupoEntidad?)null);

            var casoUso =
                new EditarGrupo(
                    mockRepo.Object,
                    mockRepoAuditoria.Object);

            var exception =
                Assert.Throws<LogicaNegocioException>(
                    () => casoUso.Ejecutar(99, request, 99));

            Assert.Equal(
                "El grupo solicitado no existe.",
                exception.Message);

            mockRepo.Verify(r =>
                r.ObtenerPorId(99),
                Times.Once);

            mockRepo.Verify(r =>
                r.Actualizar(It.IsAny<GrupoEntidad>()),
                Times.Never);

            mockRepoAuditoria.Verify(r =>
                r.Agregar(It.IsAny<Joki.LogicaNegocio.Entidades.Auditoria>()),
                Times.Never);
        }

        [Fact]
        public void EliminarGrupo_DeberiaEliminarGrupo_CuandoExiste()
        {
            var mockRepo = new Mock<IRepositorioGrupo>();
            var mockRepoAuditoria = new Mock<IRepositorioAuditoria>();

            var grupo = new GrupoEntidad
            {
                Id = 1,
                Nombre = "Running"
            };

            mockRepo.Setup(r =>
                r.ObtenerPorId(1))
                .Returns(grupo);

            var casoUso =
                new EliminarGrupo(
                    mockRepo.Object,
                    mockRepoAuditoria.Object);

            casoUso.Ejecutar(1, 99);

            mockRepo.Verify(r =>
                r.ObtenerPorId(1),
                Times.Once);

            mockRepo.Verify(r =>
                r.Actualizar(
                    It.Is<GrupoEntidad>(
                        g => g.Estado == EstadoGrupo.INACTIVO)),
                Times.Once);

            mockRepoAuditoria.Verify(r =>
                r.Agregar(It.IsAny<Joki.LogicaNegocio.Entidades.Auditoria>()),
                Times.Once);
        }

        [Fact]
        public void EliminarGrupo_DeberiaLanzarExcepcion_CuandoNoExiste()
        {
            var mockRepo = new Mock<IRepositorioGrupo>();
            var mockRepoAuditoria = new Mock<IRepositorioAuditoria>();

            mockRepo.Setup(r =>
                r.ObtenerPorId(99))
                .Returns((GrupoEntidad?)null);

            var casoUso =
                new EliminarGrupo(
                    mockRepo.Object,
                    mockRepoAuditoria.Object);

            var exception =
                Assert.Throws<LogicaNegocioException>(
                    () => casoUso.Ejecutar(99, 99));

            Assert.Equal(
                "El grupo solicitado no existe.",
                exception.Message);

            mockRepo.Verify(r =>
                r.ObtenerPorId(99),
                Times.Once);

            mockRepo.Verify(r =>
                r.Actualizar(It.IsAny<GrupoEntidad>()),
                Times.Never);

            mockRepoAuditoria.Verify(r =>
                r.Agregar(It.IsAny<Joki.LogicaNegocio.Entidades.Auditoria>()),
                Times.Never);
        }
    }
}