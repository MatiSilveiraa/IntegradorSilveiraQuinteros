using Joki.CasoUsoCompartida.DTOs.Descuento;
using Joki.LogicaAplicacion.CasosDeUso.Descuento;
using Joki.LogicaNegocio.Enums;
using Joki.LogicaNegocio.Excepciones;
using Joki.LogicaNegocio.InterfacesRepositorio;
using Moq;
using Entidades = Joki.LogicaNegocio.Entidades;

namespace Joki.Pruebas.CasosDeUso.Descuento
{
    public class ActualizarDescuentoTests
    {
        [Fact]
        public void Ejecutar_DeberiaActualizarDescuentoYRegistrarAuditoria()
        {
            var repoDescuentoMock =
                new Mock<IRepositorioDescuento>();

            var repoBeneficioMock =
                new Mock<IRepositorioBeneficio>();

            var repoAuditoriaMock =
                new Mock<IRepositorioAuditoria>();

            var descuento =
                new Entidades.Descuento
                {
                    Id = 1,
                    Nombre = "Descuento anterior",
                    Porcentaje = 20m,
                    MesesDuracion = 2,
                    Activo = true
                };

            repoDescuentoMock
                .Setup(r => r.ObtenerPorId(1))
                .Returns(descuento);

            var casoUso =
                new ActualizarDescuento(
                    repoDescuentoMock.Object,
                    repoBeneficioMock.Object,
                    repoAuditoriaMock.Object);

            casoUso.Ejecutar(
                1,
                new ActualizarDescuentoRequest
                {
                    Nombre = "Descuento actualizado",
                    Descripcion = "Nueva descripción",
                    Porcentaje = 25m,
                    MesesDuracion = 3,
                    Activo = true
                },
                4);

            Assert.Equal("Descuento actualizado", descuento.Nombre);
            Assert.Equal(25m, descuento.Porcentaje);
            Assert.Equal(3, descuento.MesesDuracion);

            repoDescuentoMock.Verify(r => r.Modificar(
                descuento), Times.Once);

            repoAuditoriaMock.Verify(r => r.Agregar(
                It.Is<Entidades.Auditoria>(a =>
                    a.UsuarioId == 4 &&
                    a.Entidad == "Descuento" &&
                    a.EntidadId == 1)), Times.Once);
        }

        [Fact]
        public void Ejecutar_DeberiaCancelarBeneficiosPendientes_CuandoSeDesactivaDescuento()
        {
            var repoDescuentoMock =
                new Mock<IRepositorioDescuento>();

            var repoBeneficioMock =
                new Mock<IRepositorioBeneficio>();

            var repoAuditoriaMock =
                new Mock<IRepositorioAuditoria>();

            var descuento =
                new Entidades.Descuento
                {
                    Id = 1,
                    Nombre = "Descuento",
                    Porcentaje = 20m,
                    Activo = true,
                    MesesDuracion = 2
                };

            var beneficios =
                new List<Entidades.Beneficio>
                {
                    new Entidades.Beneficio
                    {
                        Id = 1,
                        DescuentoId = 1,
                        Estado = EstadoBeneficio.PENDIENTE
                    },
                    new Entidades.Beneficio
                    {
                        Id = 2,
                        DescuentoId = 1,
                        Estado = EstadoBeneficio.PENDIENTE
                    }
                };

            repoDescuentoMock
                .Setup(r => r.ObtenerPorId(1))
                .Returns(descuento);

            repoBeneficioMock
                .Setup(r => r.ObtenerPendientesPorDescuento(1))
                .Returns(beneficios);

            var casoUso =
                new ActualizarDescuento(
                    repoDescuentoMock.Object,
                    repoBeneficioMock.Object,
                    repoAuditoriaMock.Object);

            casoUso.Ejecutar(
                1,
                new ActualizarDescuentoRequest
                {
                    Nombre = "Descuento",
                    Descripcion = "Desactivado",
                    Porcentaje = 20m,
                    MesesDuracion = 2,
                    Activo = false
                },
                4);

            Assert.All(beneficios, b =>
                Assert.Equal(
                    EstadoBeneficio.CANCELADO,
                    b.Estado));

            repoBeneficioMock.Verify(r => r.Modificar(
                It.IsAny<Entidades.Beneficio>()), Times.Exactly(2));
        }

        [Fact]
        public void Ejecutar_DeberiaLanzarExcepcion_CuandoDescuentoNoExiste()
        {
            var repoDescuentoMock =
                new Mock<IRepositorioDescuento>();

            repoDescuentoMock
                .Setup(r => r.ObtenerPorId(99))
                .Returns((Entidades.Descuento?)null);

            var casoUso =
                new ActualizarDescuento(
                    repoDescuentoMock.Object,
                    new Mock<IRepositorioBeneficio>().Object,
                    new Mock<IRepositorioAuditoria>().Object);

            Assert.Throws<LogicaNegocioException>(() =>
                casoUso.Ejecutar(
                    99,
                    new ActualizarDescuentoRequest
                    {
                        Nombre = "Test",
                        Porcentaje = 10,
                        MesesDuracion = 1,
                        Activo = true
                    },
                    4));
        }
    }
}