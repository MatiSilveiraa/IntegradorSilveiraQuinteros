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
    public class EditarClaseTests
    {
        [Fact]
        public void EditarClase_DeberiaEditarClase_CuandoDatosSonValidos()
        {
            var mockRepoClase = new Mock<IRepositorioClase>();
            var mockRepoGrupo = new Mock<IRepositorioGrupo>();
            var mockRepoAuditoria = new Mock<IRepositorioAuditoria>();
            var mockRepoClaseEntrenador = new Mock<IRepositorioClaseEntrenador>();

            var clase = new ClaseEntidad
            {
                Id = 1,
                GrupoId = 1,
                DiaSemana = DiaSemana.Lunes,
                HoraInicio = new TimeSpan(9, 0, 0),
                HoraFin = new TimeSpan(10, 0, 0),
                Estado = EstadoClase.Programada,
                CupoMaximo = 10
            };

            var grupo = new GrupoEntidad
            {
                Id = 1,
                Estado = EstadoGrupo.ACTIVO
            };

            var request = new EditarClaseRequest
            {
                GrupoId = 1,
                DiaSemana = DiaSemana.Martes,
                HoraInicio = new TimeSpan(18, 0, 0),
                HoraFin = new TimeSpan(19, 0, 0),
                Latitud = -34.90m,
                Longitud = -56.16m,
                CodigoPostal = "11000",
                RadioGeolocalizacion = 100,
                EsFija = true,
                FechaInicio = DateTime.Now,
                FechaFin = DateTime.Now.AddMonths(3),
                CupoMaximo = 20
            };

            mockRepoClase
                .Setup(r => r.ObtenerPorId(1))
                .Returns(clase);

            mockRepoGrupo
                .Setup(r => r.ObtenerPorId(1))
                .Returns(grupo);

            var casoUso =
                new EditarClase(
                    mockRepoClase.Object,
                    mockRepoGrupo.Object,
                    mockRepoAuditoria.Object,
                    mockRepoClaseEntrenador.Object
                    );

            var resultado =
                casoUso.Ejecutar(1, request, 99);

            Assert.NotNull(resultado);
            Assert.Equal(1, resultado.Id);
            Assert.Equal("Martes", resultado.DiaSemana);
            Assert.Equal(new TimeSpan(18, 0, 0), resultado.HoraInicio);
            Assert.Equal(new TimeSpan(19, 0, 0), resultado.HoraFin);
            Assert.Equal(20, resultado.CupoMaximo);

            mockRepoClase.Verify(r =>
                r.Actualizar(It.IsAny<ClaseEntidad>()),
                Times.Once);

            mockRepoAuditoria.Verify(r =>
                r.Agregar(It.IsAny<Joki.LogicaNegocio.Entidades.Auditoria>()),
                Times.Once);
        }

        [Fact]
        public void EditarClase_DeberiaLanzarExcepcion_CuandoClaseNoExiste()
        {
            var mockRepoClase = new Mock<IRepositorioClase>();
            var mockRepoGrupo = new Mock<IRepositorioGrupo>();
            var mockRepoAuditoria = new Mock<IRepositorioAuditoria>();
            var mockRepoClaseEntrenador = new Mock<IRepositorioClaseEntrenador>();

            var request = new EditarClaseRequest
            {
                GrupoId = 1,
                DiaSemana = DiaSemana.Martes,
                HoraInicio = new TimeSpan(18, 0, 0),
                HoraFin = new TimeSpan(19, 0, 0),
                CupoMaximo = 20
            };

            mockRepoClase
                .Setup(r => r.ObtenerPorId(1))
                .Returns((ClaseEntidad)null);

            var casoUso =
                new EditarClase(
                    mockRepoClase.Object,
                    mockRepoGrupo.Object,
                    mockRepoAuditoria.Object,
                    mockRepoClaseEntrenador.Object
                    );

            var ex =
                Assert.Throws<LogicaNegocioException>(
                    () => casoUso.Ejecutar(1, request, 99));

            Assert.Equal("La clase no existe", ex.Message);

            mockRepoAuditoria.Verify(r =>
                r.Agregar(It.IsAny<Joki.LogicaNegocio.Entidades.Auditoria>()),
                Times.Never);
        }

        [Fact]
        public void EditarClase_DeberiaLanzarExcepcion_CuandoGrupoNoExiste()
        {
            var mockRepoClase = new Mock<IRepositorioClase>();
            var mockRepoGrupo = new Mock<IRepositorioGrupo>();
            var mockRepoAuditoria = new Mock<IRepositorioAuditoria>();
            var mockRepoClaseEntrenador = new Mock<IRepositorioClaseEntrenador>();

            var clase = new ClaseEntidad
            {
                Id = 1,
                GrupoId = 1
            };

            var request = new EditarClaseRequest
            {
                GrupoId = 99,
                DiaSemana = DiaSemana.Martes,
                HoraInicio = new TimeSpan(18, 0, 0),
                HoraFin = new TimeSpan(19, 0, 0),
                CupoMaximo = 20
            };

            mockRepoClase
                .Setup(r => r.ObtenerPorId(1))
                .Returns(clase);

            mockRepoGrupo
                .Setup(r => r.ObtenerPorId(99))
                .Returns((GrupoEntidad)null);

            var casoUso =
                new EditarClase(
                    mockRepoClase.Object,
                    mockRepoGrupo.Object,
                    mockRepoAuditoria.Object,
                    mockRepoClaseEntrenador.Object
                    );

            var ex =
                Assert.Throws<LogicaNegocioException>(
                    () => casoUso.Ejecutar(1, request, 99));

            Assert.Equal("El grupo no existe", ex.Message);

            mockRepoAuditoria.Verify(r =>
                r.Agregar(It.IsAny<Joki.LogicaNegocio.Entidades.Auditoria>()),
                Times.Never);
        }
    }
}