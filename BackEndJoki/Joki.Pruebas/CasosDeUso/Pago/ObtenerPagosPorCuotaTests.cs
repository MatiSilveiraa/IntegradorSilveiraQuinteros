using Joki.LogicaAplicacion.CasosDeUso.Pago;
using Joki.LogicaNegocio.Enums;
using Joki.LogicaNegocio.InterfacesRepositorio;
using Moq;

using Entidades = Joki.LogicaNegocio.Entidades;

namespace Joki.Pruebas.CasosDeUso.Pago
{
    public class ObtenerPagosPorCuotaTests
    {
        [Fact]
        public void Ejecutar_DeberiaRetornarPagosDeUnaCuota()
        {
            var repoPagoMock = new Mock<IRepositorioPago>();

            var pagos = new List<Entidades.Pago>
            {
                new Entidades.Pago
                {
                    Id = 1,
                    CuotaId = 3,
                    MedioPago = MedioPago.EFECTIVO,
                    FechaPago = DateTime.Now,
                    Monto = 1390m,
                    ReferenciaExterna = "Pago en efectivo al entrenador"
                }
            };

            repoPagoMock
                .Setup(r => r.ObtenerPorCuota(3))
                .Returns(pagos);

            var casoUso =
                new ObtenerPagosPorCuota(repoPagoMock.Object);

            var resultado =
                casoUso.Ejecutar(3).ToList();

            Assert.Single(resultado);
            Assert.Equal(1, resultado[0].Id);
            Assert.Equal(3, resultado[0].CuotaId);
            Assert.Equal("EFECTIVO", resultado[0].MedioPago);
            Assert.Equal(1390m, resultado[0].Monto);
            Assert.Equal("Pago en efectivo al entrenador", resultado[0].ReferenciaExterna);
        }

        [Fact]
        public void Ejecutar_DeberiaRetornarListaVacia_CuandoNoHayPagos()
        {
            var repoPagoMock = new Mock<IRepositorioPago>();

            repoPagoMock
                .Setup(r => r.ObtenerPorCuota(3))
                .Returns(new List<Entidades.Pago>());

            var casoUso =
                new ObtenerPagosPorCuota(repoPagoMock.Object);

            var resultado =
                casoUso.Ejecutar(3).ToList();

            Assert.Empty(resultado);
        }
    }
}