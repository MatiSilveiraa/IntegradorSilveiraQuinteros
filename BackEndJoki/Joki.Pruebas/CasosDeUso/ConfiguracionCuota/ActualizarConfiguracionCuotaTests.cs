using Joki.CasoUsoCompartida.DTOs.ConfiguracionCuota;
using Joki.LogicaAplicacion.CasosDeUso.ConfiguracionCuota;
using Joki.LogicaNegocio.Excepciones;
using Joki.LogicaNegocio.InterfacesRepositorio;
using Moq;
using Entidades = Joki.LogicaNegocio.Entidades;

namespace Joki.Pruebas.CasosDeUso.ConfiguracionCuota
{
    public class ActualizarConfiguracionCuotaTests
    {
        [Fact]
        public void Ejecutar_DeberiaCrearNuevaConfiguracionYDesactivarAnterior()
        {
            var repoConfigMock =
                new Mock<IRepositorioConfiguracionCuota>();

            var repoAuditoriaMock =
                new Mock<IRepositorioAuditoria>();

            var configuracionAnterior =
                new Entidades.ConfiguracionCuota
                {
                    Id = 1,
                    MontoMensual = 1390m,
                    Activa = true
                };

            repoConfigMock
                .Setup(r => r.ObtenerActiva())
                .Returns(configuracionAnterior);

            var casoUso =
                new ActualizarConfiguracionCuota(
                    repoConfigMock.Object,
                    repoAuditoriaMock.Object);

            casoUso.Ejecutar(
                new ActualizarConfiguracionCuotaRequest
                {
                    MontoMensual = 2000m
                },
                4);

            Assert.False(configuracionAnterior.Activa);

            repoConfigMock.Verify(r => r.Modificar(
                configuracionAnterior), Times.Once);

            repoConfigMock.Verify(r => r.Agregar(
                It.Is<Entidades.ConfiguracionCuota>(c =>
                    c.MontoMensual == 2000m &&
                    c.Activa)), Times.Once);

            repoAuditoriaMock.Verify(r => r.Agregar(
                It.Is<Entidades.Auditoria>(a =>
                    a.UsuarioId == 4 &&
                    a.Entidad == "ConfiguracionCuota")), Times.Once);
        }

        [Fact]
        public void Ejecutar_DeberiaLanzarExcepcion_CuandoMontoEsMenorOIgualACero()
        {
            var repoConfigMock =
                new Mock<IRepositorioConfiguracionCuota>();

            var repoAuditoriaMock =
                new Mock<IRepositorioAuditoria>();

            var casoUso =
                new ActualizarConfiguracionCuota(
                    repoConfigMock.Object,
                    repoAuditoriaMock.Object);

            Assert.Throws<LogicaNegocioException>(() =>
                casoUso.Ejecutar(
                    new ActualizarConfiguracionCuotaRequest
                    {
                        MontoMensual = 0
                    },
                    4));
        }
    }
}