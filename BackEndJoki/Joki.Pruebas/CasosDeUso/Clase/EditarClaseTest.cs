using Joki.CasoUsoCompartida.DTOs.Clase;
using Joki.LogicaAplicacion.CasosDeUso.Clase;
using Joki.LogicaNegocio.Enums;
using Joki.LogicaNegocio.Excepciones;
using Joki.LogicaNegocio.InterfacesRepositorio;
using Joki.LogicaNegocio.ValueObjects;
using Moq;

using AuditoriaEntidad =
    Joki.LogicaNegocio.Entidades.Auditoria;

using ClaseEntidad =
    Joki.LogicaNegocio.Entidades.Clase;

using ClaseEntrenadorEntidad =
    Joki.LogicaNegocio.Entidades.ClaseEntrenador;

using EntrenadorEntidad =
    Joki.LogicaNegocio.Entidades.Entrenador;

using GrupoEntidad =
    Joki.LogicaNegocio.Entidades.Grupo;

namespace Joki.Pruebas.CasosDeUso.Clases
{
    public class EditarClaseTests
    {
        private readonly Mock<IRepositorioClase>
            _mockRepoClase;

        private readonly Mock<IRepositorioGrupo>
            _mockRepoGrupo;

        private readonly Mock<IRepositorioAuditoria>
            _mockRepoAuditoria;

        private readonly Mock<IRepositorioClaseEntrenador>
            _mockRepoClaseEntrenador;

        private readonly Mock<IRepositorioUsuario>
            _mockRepoUsuario;

        private readonly EditarClase
            _casoUso;

        public EditarClaseTests()
        {
            _mockRepoClase =
                new Mock<IRepositorioClase>();

            _mockRepoGrupo =
                new Mock<IRepositorioGrupo>();

            _mockRepoAuditoria =
                new Mock<IRepositorioAuditoria>();

            _mockRepoClaseEntrenador =
                new Mock<IRepositorioClaseEntrenador>();

            _mockRepoUsuario =
                new Mock<IRepositorioUsuario>();

            _casoUso =
                new EditarClase(
                    _mockRepoClase.Object,
                    _mockRepoGrupo.Object,
                    _mockRepoAuditoria.Object,
                    _mockRepoClaseEntrenador.Object,
                    _mockRepoUsuario.Object);
        }

        [Fact]
        public void EditarClase_DeberiaEditarClase_CuandoDatosSonValidos()
        {
            var clase =
                CrearClaseExistente();

            var grupo =
                CrearGrupoActivo();

            var entrenador =
                CrearEntrenadorActivo(5);

            var request =
                CrearRequestValido();

            _mockRepoClase
                .Setup(r =>
                    r.ObtenerPorId(1))
                .Returns(clase);

            _mockRepoGrupo
                .Setup(r =>
                    r.ObtenerPorId(1))
                .Returns(grupo);

            _mockRepoUsuario
                .Setup(r =>
                    r.ObtenerPorId(5))
                .Returns(entrenador);

            _mockRepoClaseEntrenador
                .Setup(r =>
                    r.ObtenerConflictos(
                        It.IsAny<IEnumerable<int>>(),
                        request.DiaSemana,
                        request.HoraInicio,
                        request.HoraFin,
                        request.FechaInicio,
                        request.FechaFin,
                        1))
                .Returns(
                    new List<ConflictoEntrenadorVO>());

            var resultado =
                _casoUso.Ejecutar(
                    id: 1,
                    request,
                    usuarioId: 99);

            Assert.NotNull(
                resultado);

            Assert.False(
                resultado.RequiereConfirmacion);

            Assert.NotNull(
                resultado.Clase);

            Assert.Equal(
                1,
                resultado.Clase.Id);

            Assert.Equal(
                "Martes",
                resultado.Clase.DiaSemana);

            Assert.Equal(
                new TimeSpan(18, 0, 0),
                resultado.Clase.HoraInicio);

            Assert.Equal(
                new TimeSpan(19, 0, 0),
                resultado.Clase.HoraFin);

            Assert.Equal(
                20,
                resultado.Clase.CupoMaximo);

            _mockRepoClase.Verify(r =>
                r.Actualizar(
                    It.Is<ClaseEntidad>(c =>
                        c.DiaSemana ==
                            DiaSemana.Martes &&
                        c.HoraInicio ==
                            new TimeSpan(18, 0, 0) &&
                        c.HoraFin ==
                            new TimeSpan(19, 0, 0))),
                Times.Once);

            _mockRepoClaseEntrenador.Verify(r =>
                r.EliminarPorClase(1),
                Times.Once);

            _mockRepoClaseEntrenador.Verify(r =>
                r.AgregarVarios(
                    It.Is<IEnumerable<ClaseEntrenadorEntidad>>(
                        relaciones =>
                            relaciones.Count() == 1 &&
                            relaciones.First()
                                .EntrenadorId == 5 &&
                            relaciones.First()
                                .EsPrincipal)),
                Times.Once);

            _mockRepoAuditoria.Verify(r =>
                r.Agregar(
                    It.IsAny<AuditoriaEntidad>()),
                Times.Once);
        }

        [Fact]
        public void EditarClase_DeberiaDevolverAdvertencia_CuandoExisteConflicto()
        {
            var clase =
                CrearClaseExistente();

            var grupo =
                CrearGrupoActivo();

            var entrenador =
                CrearEntrenadorActivo(5);

            var request =
                CrearRequestValido();

            request.ForzarAsignacion =
                false;

            _mockRepoClase
                .Setup(r =>
                    r.ObtenerPorId(1))
                .Returns(clase);

            _mockRepoGrupo
                .Setup(r =>
                    r.ObtenerPorId(1))
                .Returns(grupo);

            _mockRepoUsuario
                .Setup(r =>
                    r.ObtenerPorId(5))
                .Returns(entrenador);

            _mockRepoClaseEntrenador
                .Setup(r =>
                    r.ObtenerConflictos(
                        It.IsAny<IEnumerable<int>>(),
                        request.DiaSemana,
                        request.HoraInicio,
                        request.HoraFin,
                        request.FechaInicio,
                        request.FechaFin,
                        1))
                .Returns(new List<ConflictoEntrenadorVO>
                {
                    CrearConflicto()
                });

            var resultado =
                _casoUso.Ejecutar(
                    id: 1,
                    request,
                    usuarioId: 99);

            Assert.True(
                resultado.RequiereConfirmacion);

            Assert.Null(
                resultado.Clase);

            Assert.Single(
                resultado.Conflictos);

            Assert.Equal(
                5,
                resultado.Conflictos[0]
                    .EntrenadorId);

            _mockRepoClase.Verify(r =>
                r.Actualizar(
                    It.IsAny<ClaseEntidad>()),
                Times.Never);

            _mockRepoClaseEntrenador.Verify(r =>
                r.EliminarPorClase(
                    It.IsAny<int>()),
                Times.Never);

            _mockRepoAuditoria.Verify(r =>
                r.Agregar(
                    It.IsAny<AuditoriaEntidad>()),
                Times.Never);
        }

        [Fact]
        public void EditarClase_DeberiaEditarIgualmente_CuandoExisteConflictoYSeFuerza()
        {
            var clase =
                CrearClaseExistente();

            var grupo =
                CrearGrupoActivo();

            var entrenador =
                CrearEntrenadorActivo(5);

            var request =
                CrearRequestValido();

            request.ForzarAsignacion =
                true;

            _mockRepoClase
                .Setup(r =>
                    r.ObtenerPorId(1))
                .Returns(clase);

            _mockRepoGrupo
                .Setup(r =>
                    r.ObtenerPorId(1))
                .Returns(grupo);

            _mockRepoUsuario
                .Setup(r =>
                    r.ObtenerPorId(5))
                .Returns(entrenador);

            _mockRepoClaseEntrenador
                .Setup(r =>
                    r.ObtenerConflictos(
                        It.IsAny<IEnumerable<int>>(),
                        request.DiaSemana,
                        request.HoraInicio,
                        request.HoraFin,
                        request.FechaInicio,
                        request.FechaFin,
                        1))
                .Returns(new List<ConflictoEntrenadorVO>
                {
                    CrearConflicto()
                });

            var resultado =
                _casoUso.Ejecutar(
                    id: 1,
                    request,
                    usuarioId: 99);

            Assert.False(
                resultado.RequiereConfirmacion);

            Assert.NotNull(
                resultado.Clase);

            Assert.Equal(
                "Martes",
                resultado.Clase.DiaSemana);

            _mockRepoClase.Verify(r =>
                r.Actualizar(
                    It.IsAny<ClaseEntidad>()),
                Times.Once);

            _mockRepoClaseEntrenador.Verify(r =>
                r.EliminarPorClase(1),
                Times.Once);

            _mockRepoClaseEntrenador.Verify(r =>
                r.AgregarVarios(
                    It.IsAny<IEnumerable<ClaseEntrenadorEntidad>>()),
                Times.Once);
        }

        [Fact]
        public void EditarClase_DeberiaLanzarExcepcion_CuandoClaseNoExiste()
        {
            var request =
                CrearRequestValido();

            _mockRepoClase
                .Setup(r =>
                    r.ObtenerPorId(1))
                .Returns(
                    (ClaseEntidad?)null);

            var ex =
                Assert.Throws<LogicaNegocioException>(
                    () => _casoUso.Ejecutar(
                        id: 1,
                        request,
                        usuarioId: 99));

            Assert.Equal(
                "La clase no existe",
                ex.Message);

            _mockRepoGrupo.Verify(r =>
                r.ObtenerPorId(
                    It.IsAny<int>()),
                Times.Never);

            _mockRepoAuditoria.Verify(r =>
                r.Agregar(
                    It.IsAny<AuditoriaEntidad>()),
                Times.Never);
        }

        [Fact]
        public void EditarClase_DeberiaLanzarExcepcion_CuandoGrupoNoExiste()
        {
            var clase =
                CrearClaseExistente();

            var request =
                CrearRequestValido();

            request.GrupoId =
                99;

            _mockRepoClase
                .Setup(r =>
                    r.ObtenerPorId(1))
                .Returns(clase);

            _mockRepoGrupo
                .Setup(r =>
                    r.ObtenerPorId(99))
                .Returns(
                    (GrupoEntidad?)null);

            var ex =
                Assert.Throws<LogicaNegocioException>(
                    () => _casoUso.Ejecutar(
                        id: 1,
                        request,
                        usuarioId: 99));

            Assert.Equal(
                "El grupo no existe",
                ex.Message);

            _mockRepoClase.Verify(r =>
                r.Actualizar(
                    It.IsAny<ClaseEntidad>()),
                Times.Never);

            _mockRepoAuditoria.Verify(r =>
                r.Agregar(
                    It.IsAny<AuditoriaEntidad>()),
                Times.Never);
        }

        [Fact]
        public void EditarClase_DeberiaLanzarExcepcion_CuandoEntrenadorNoEsValido()
        {
            var clase =
                CrearClaseExistente();

            var grupo =
                CrearGrupoActivo();

            var request =
                CrearRequestValido();

            _mockRepoClase
                .Setup(r =>
                    r.ObtenerPorId(1))
                .Returns(clase);

            _mockRepoGrupo
                .Setup(r =>
                    r.ObtenerPorId(1))
                .Returns(grupo);

            _mockRepoUsuario
                .Setup(r =>
                    r.ObtenerPorId(5))
                .Returns((EntrenadorEntidad?)null);

            var ex =
                Assert.Throws<LogicaNegocioException>(
                    () => _casoUso.Ejecutar(
                        id: 1,
                        request,
                        usuarioId: 99));

            Assert.Contains(
                "no es un entrenador válido",
                ex.Message);

            _mockRepoClase.Verify(r =>
                r.Actualizar(
                    It.IsAny<ClaseEntidad>()),
                Times.Never);
        }

        private static ClaseEntidad
            CrearClaseExistente()
        {
            return new ClaseEntidad
            {
                Id = 1,

                GrupoId = 1,

                DiaSemana =
                    DiaSemana.Lunes,

                HoraInicio =
                    new TimeSpan(9, 0, 0),

                HoraFin =
                    new TimeSpan(10, 0, 0),

                Estado =
                    EstadoClase.Programada,

                CupoMaximo =
                    10,

                FechaInicio =
                    new DateTime(2026, 6, 1),

                FechaFin =
                    new DateTime(2026, 9, 1)
            };
        }

        private static EditarClaseRequest
            CrearRequestValido()
        {
            return new EditarClaseRequest
            {
                GrupoId = 1,

                DiaSemana =
                    DiaSemana.Martes,

                HoraInicio =
                    new TimeSpan(18, 0, 0),

                HoraFin =
                    new TimeSpan(19, 0, 0),

                Latitud =
                    -34.90m,

                Longitud =
                    -56.16m,

                CodigoPostal =
                    "11000",

                RadioGeolocalizacion =
                    100,

                EsFija =
                    true,

                FechaInicio =
                    new DateTime(2026, 7, 1),

                FechaFin =
                    new DateTime(2026, 10, 1),

                CupoMaximo =
                    20,

                EntrenadoresIds =
                    new List<int> { 5 },

                EntrenadorPrincipalId =
                    5,

                ForzarAsignacion =
                    false
            };
        }

        private static GrupoEntidad
            CrearGrupoActivo()
        {
            return new GrupoEntidad
            {
                Id = 1,

                Nombre =
                    "Running",

                Estado =
                    EstadoGrupo.ACTIVO
            };
        }

        private static EntrenadorEntidad
            CrearEntrenadorActivo(
                int id)
        {
            return new EntrenadorEntidad
            {
                UsuarioId =
                    id,

                Estado =
                    EstadoUsuario.ACTIVO
            };
        }

        private static ConflictoEntrenadorVO
            CrearConflicto()
        {
            return new ConflictoEntrenadorVO
            {
                EntrenadorId =
                    5,

                Entrenador =
                    "Juan Pérez",

                ClaseId =
                    20,

                Grupo =
                    "Funcional tarde",

                DiaSemana =
                    "Martes",

                HoraInicio =
                    new TimeSpan(17, 30, 0),

                HoraFin =
                    new TimeSpan(18, 30, 0)
            };
        }
    }
}