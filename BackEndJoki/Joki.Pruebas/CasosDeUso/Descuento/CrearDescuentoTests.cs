using Joki.CasoUsoCompartida.DTOs.Descuento;
using Joki.LogicaAplicacion.CasosDeUso.Descuento;
using Joki.LogicaNegocio.Enums;
using Joki.LogicaNegocio.Excepciones;
using Joki.LogicaNegocio.InterfacesRepositorio;
using Moq;
using Entidades = Joki.LogicaNegocio.Entidades;

namespace Joki.Pruebas.CasosDeUso.Descuento
{
    public class CrearDescuentoTests
    {
        [Fact]
        public void Ejecutar_DeberiaCrearDescuentoYBeneficiosParaTodos()
        {
            var repoDescuentoMock =
                new Mock<IRepositorioDescuento>();

            var repoBeneficioMock =
                new Mock<IRepositorioBeneficio>();

            var repoAlumnoMock =
                new Mock<IRepositorioAlumno>();

            var repoAuditoriaMock =
                new Mock<IRepositorioAuditoria>();

            repoAlumnoMock
                .Setup(r => r.ObtenerActivos())
                .Returns(new List<Entidades.Alumno>
                {
                    new Entidades.Alumno { UsuarioId = 1 },
                    new Entidades.Alumno { UsuarioId = 2 }
                });

            var casoUso =
                new CrearDescuento(
                    repoDescuentoMock.Object,
                    repoBeneficioMock.Object,
                    repoAlumnoMock.Object,
                    repoAuditoriaMock.Object);

            casoUso.Ejecutar(
                new CrearDescuentoRequest
                {
                    Nombre = "Descuento aniversario",
                    Descripcion = "Descuento para todos",
                    Porcentaje = 20m,
                    MesesDuracion = 2,
                    Tipo = "ANIVERSARIO",
                    Alcance = "TODOS",
                    AlumnosIds = new List<int>()
                },
                99);

            repoDescuentoMock.Verify(r => r.Agregar(
                It.Is<Entidades.Descuento>(d =>
                    d.Nombre == "Descuento aniversario" &&
                    d.Porcentaje == 20m &&
                    d.Tipo == TipoDescuento.ANIVERSARIO &&
                    d.Alcance == AlcanceDescuento.TODOS)), Times.Once);

            repoBeneficioMock.Verify(r => r.Agregar(
                It.Is<Entidades.Beneficio>(b =>
                    b.MesesDuracion == 2 &&
                    b.MesesAplicados == 0 &&
                    b.Estado == EstadoBeneficio.PENDIENTE)), Times.Exactly(2));

            repoAuditoriaMock.Verify(r => r.Agregar(
                It.Is<Entidades.Auditoria>(a =>
                    a.UsuarioId == 99 &&
                    a.Entidad == "Descuento" &&
                    a.Accion.Contains("Creó descuento"))), Times.Once);
        }

        [Fact]
        public void Ejecutar_DeberiaCrearBeneficiosSoloParaAlumnosSeleccionados()
        {
            var repoDescuentoMock =
                new Mock<IRepositorioDescuento>();

            var repoBeneficioMock =
                new Mock<IRepositorioBeneficio>();

            var repoAlumnoMock =
                new Mock<IRepositorioAlumno>();

            var repoAuditoriaMock =
                new Mock<IRepositorioAuditoria>();

            repoAlumnoMock
                .Setup(r => r.ObtenerPorId(1))
                .Returns(new Entidades.Alumno { UsuarioId = 1 });

            repoAlumnoMock
                .Setup(r => r.ObtenerPorId(2))
                .Returns(new Entidades.Alumno { UsuarioId = 2 });

            var casoUso =
                new CrearDescuento(
                    repoDescuentoMock.Object,
                    repoBeneficioMock.Object,
                    repoAlumnoMock.Object,
                    repoAuditoriaMock.Object);

            casoUso.Ejecutar(
                new CrearDescuentoRequest
                {
                    Nombre = "Descuento especial",
                    Descripcion = "Solo seleccionados",
                    Porcentaje = 15m,
                    MesesDuracion = 1,
                    Tipo = "PERSONALIZADO",
                    Alcance = "ALUMNOS_SELECCIONADOS",
                    AlumnosIds = new List<int> { 1, 2 }
                },
                99);

            repoBeneficioMock.Verify(r => r.Agregar(
                It.IsAny<Entidades.Beneficio>()), Times.Exactly(2));

            repoAuditoriaMock.Verify(r => r.Agregar(
                It.Is<Entidades.Auditoria>(a =>
                    a.UsuarioId == 99 &&
                    a.Entidad == "Descuento" &&
                    a.Accion.Contains("Creó descuento"))), Times.Once);
        }

        [Fact]
        public void Ejecutar_DeberiaLanzarExcepcion_CuandoNombreEsVacio()
        {
            var repoAuditoriaMock =
                new Mock<IRepositorioAuditoria>();

            var casoUso =
                new CrearDescuento(
                    new Mock<IRepositorioDescuento>().Object,
                    new Mock<IRepositorioBeneficio>().Object,
                    new Mock<IRepositorioAlumno>().Object,
                    repoAuditoriaMock.Object);

            Assert.Throws<LogicaNegocioException>(() =>
                casoUso.Ejecutar(
                    new CrearDescuentoRequest
                    {
                        Nombre = "",
                        Porcentaje = 20m,
                        MesesDuracion = 1,
                        Tipo = "ANIVERSARIO",
                        Alcance = "TODOS"
                    },
                    99));

            repoAuditoriaMock.Verify(
                r => r.Agregar(It.IsAny<Entidades.Auditoria>()),
                Times.Never);
        }

        [Fact]
        public void Ejecutar_DeberiaLanzarExcepcion_CuandoPorcentajeEsInvalido()
        {
            var repoAuditoriaMock =
                new Mock<IRepositorioAuditoria>();

            var casoUso =
                new CrearDescuento(
                    new Mock<IRepositorioDescuento>().Object,
                    new Mock<IRepositorioBeneficio>().Object,
                    new Mock<IRepositorioAlumno>().Object,
                    repoAuditoriaMock.Object);

            Assert.Throws<LogicaNegocioException>(() =>
                casoUso.Ejecutar(
                    new CrearDescuentoRequest
                    {
                        Nombre = "Descuento inválido",
                        Porcentaje = 150m,
                        MesesDuracion = 1,
                        Tipo = "ANIVERSARIO",
                        Alcance = "TODOS"
                    },
                    99));

            repoAuditoriaMock.Verify(
                r => r.Agregar(It.IsAny<Entidades.Auditoria>()),
                Times.Never);
        }
    }
}