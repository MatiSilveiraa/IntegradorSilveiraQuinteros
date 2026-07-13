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
    public class CrearClaseTests
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

        private readonly CrearClase
            _casoUso;

        public CrearClaseTests()
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
                new CrearClase(
                    _mockRepoClase.Object,
                    _mockRepoGrupo.Object,
                    _mockRepoAuditoria.Object,
                    _mockRepoClaseEntrenador.Object,
                    _mockRepoUsuario.Object);
        }

        [Fact]
        public void CrearClase_DeberiaCrearClase_CuandoDatosSonValidos()
        {
            var grupo =
                CrearGrupoActivo();

            var entrenador =
                CrearEntrenadorActivo(5);

            var request =
                CrearRequestValido();

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
                        null))
                .Returns(
                    new List<ConflictoEntrenadorVO>());

            _mockRepoClase
                .Setup(r =>
                    r.Agregar(
                        It.IsAny<ClaseEntidad>()))
                .Returns(
                    (ClaseEntidad clase) =>
                    {
                        clase.Id = 1;
                        return clase;
                    });

            var resultado =
                _casoUso.Ejecutar(
                    request,
                    usuarioId: 99);

            Assert.NotNull(resultado);

            Assert.False(
                resultado.RequiereConfirmacion);

            Assert.NotNull(
                resultado.Clase);

            Assert.Equal(
                1,
                resultado.Clase.Id);

            Assert.Equal(
                "Lunes",
                resultado.Clase.DiaSemana);

            Assert.Equal(
                new TimeSpan(19, 0, 0),
                resultado.Clase.HoraInicio);

            Assert.Equal(
                new TimeSpan(20, 0, 0),
                resultado.Clase.HoraFin);

            Assert.Equal(
                20,
                resultado.Clase.CupoMaximo);

            Assert.Equal(
                "Clase creada correctamente",
                resultado.Mensaje);

            _mockRepoClase.Verify(r =>
                r.Agregar(
                    It.IsAny<ClaseEntidad>()),
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
        public void CrearClase_DeberiaDevolverAdvertencia_CuandoEntrenadorTieneConflicto()
        {
            var grupo =
                CrearGrupoActivo();

            var entrenador =
                CrearEntrenadorActivo(5);

            var request =
                CrearRequestValido();

            request.ForzarAsignacion =
                false;

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
                        null))
                .Returns(new List<ConflictoEntrenadorVO>
                {
                    CrearConflicto()
                });

            var resultado =
                _casoUso.Ejecutar(
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

            Assert.Contains(
                "¿Desea continuar igualmente?",
                resultado.Mensaje);

            _mockRepoClase.Verify(r =>
                r.Agregar(
                    It.IsAny<ClaseEntidad>()),
                Times.Never);

            _mockRepoClaseEntrenador.Verify(r =>
                r.AgregarVarios(
                    It.IsAny<IEnumerable<ClaseEntrenadorEntidad>>()),
                Times.Never);

            _mockRepoAuditoria.Verify(r =>
                r.Agregar(
                    It.IsAny<AuditoriaEntidad>()),
                Times.Never);
        }

        [Fact]
        public void CrearClase_DeberiaCrearIgualmente_CuandoExisteConflictoYSeFuerza()
        {
            var grupo =
                CrearGrupoActivo();

            var entrenador =
                CrearEntrenadorActivo(5);

            var request =
                CrearRequestValido();

            request.ForzarAsignacion =
                true;

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
                        null))
                .Returns(new List<ConflictoEntrenadorVO>
                {
                    CrearConflicto()
                });

            _mockRepoClase
                .Setup(r =>
                    r.Agregar(
                        It.IsAny<ClaseEntidad>()))
                .Returns(
                    (ClaseEntidad clase) =>
                    {
                        clase.Id = 10;
                        return clase;
                    });

            var resultado =
                _casoUso.Ejecutar(
                    request,
                    usuarioId: 99);

            Assert.False(
                resultado.RequiereConfirmacion);

            Assert.NotNull(
                resultado.Clase);

            Assert.Equal(
                10,
                resultado.Clase.Id);

            _mockRepoClase.Verify(r =>
                r.Agregar(
                    It.IsAny<ClaseEntidad>()),
                Times.Once);

            _mockRepoClaseEntrenador.Verify(r =>
                r.AgregarVarios(
                    It.IsAny<IEnumerable<ClaseEntrenadorEntidad>>()),
                Times.Once);
        }

        [Fact]
        public void CrearClase_DeberiaLanzarExcepcion_CuandoGrupoNoExiste()
        {
            var request =
                CrearRequestValido();

            _mockRepoGrupo
                .Setup(r =>
                    r.ObtenerPorId(1))
                .Returns(
                    (GrupoEntidad?)null);

            var ex =
                Assert.Throws<LogicaNegocioException>(
                    () => _casoUso.Ejecutar(
                        request,
                        usuarioId: 99));

            Assert.Equal(
                "El grupo no existe",
                ex.Message);

            _mockRepoClase.Verify(r =>
                r.Agregar(
                    It.IsAny<ClaseEntidad>()),
                Times.Never);

            _mockRepoAuditoria.Verify(r =>
                r.Agregar(
                    It.IsAny<AuditoriaEntidad>()),
                Times.Never);
        }

        [Fact]
        public void CrearClase_DeberiaLanzarExcepcion_CuandoUsuarioNoEsEntrenador()
        {
            var grupo =
                CrearGrupoActivo();

            var request =
                CrearRequestValido();

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
                        request,
                        usuarioId: 99));

            Assert.Contains(
                "no es un entrenador válido",
                ex.Message);

            _mockRepoClase.Verify(r =>
                r.Agregar(
                    It.IsAny<ClaseEntidad>()),
                Times.Never);
        }

        [Fact]
        public void CrearClase_DeberiaLanzarExcepcion_CuandoPrincipalNoEstaEnLista()
        {
            var grupo =
                CrearGrupoActivo();

            var entrenador =
                CrearEntrenadorActivo(5);

            var request =
                CrearRequestValido();

            request.EntrenadorPrincipalId =
                8;

            _mockRepoGrupo
                .Setup(r =>
                    r.ObtenerPorId(1))
                .Returns(grupo);

            _mockRepoUsuario
                .Setup(r =>
                    r.ObtenerPorId(5))
                .Returns(entrenador);

            var ex =
                Assert.Throws<LogicaNegocioException>(
                    () => _casoUso.Ejecutar(
                        request,
                        usuarioId: 99));

            Assert.Equal(
                "El entrenador principal debe estar incluido en la lista de entrenadores",
                ex.Message);

            _mockRepoClase.Verify(r =>
                r.Agregar(
                    It.IsAny<ClaseEntidad>()),
                Times.Never);
        }

        private static CrearClaseRequest
            CrearRequestValido()
        {
            return new CrearClaseRequest
            {
                GrupoId = 1,

                DiaSemana =
                    DiaSemana.Lunes,

                HoraInicio =
                    new TimeSpan(19, 0, 0),

                HoraFin =
                    new TimeSpan(20, 0, 0),

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
                    "Lunes",

                HoraInicio =
                    new TimeSpan(18, 30, 0),

                HoraFin =
                    new TimeSpan(19, 30, 0)
            };
        }
    }
}