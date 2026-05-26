using Joki.LogicaAplicacion.CasosDeUso.Cuota;
using Joki.LogicaNegocio.Enums;
using Joki.LogicaNegocio.Excepciones;
using Joki.LogicaNegocio.InterfacesRepositorio;
using Moq;
using Entidades = Joki.LogicaNegocio.Entidades;

namespace Joki.Pruebas.CasosDeUso.Cuota
{
    public class ObtenerCuotaActualAlumnoTests
    {
        [Fact]
        public void Ejecutar_DeberiaRetornarCuotaActual()
        {
            var repoCuotaMock = new Mock<IRepositorioCuota>();

            var cuota = new Entidades.Cuota
            {
                Id = 1,
                AlumnoId = 3,
                Mes = DateTime.Now.Month,
                Anio = DateTime.Now.Year,
                MontoBase = 1390m,
                Descuento = 139m,
                MontoFinal = 1251m,
                Estado = EstadoCuota.PENDIENTE
            };

            repoCuotaMock
                .Setup(r => r.ObtenerPorAlumnoMesYAnio(
                    3,
                    DateTime.Now.Month,
                    DateTime.Now.Year))
                .Returns(cuota);

            var casoUso =
                new ObtenerCuotaActualAlumno(repoCuotaMock.Object);

            var resultado =
                casoUso.Ejecutar(3);

            Assert.Equal(1, resultado.Id);
            Assert.Equal(3, resultado.AlumnoId);
            Assert.Equal(1390m, resultado.MontoBase);
            Assert.Equal(139m, resultado.Descuento);
            Assert.Equal(1251m, resultado.MontoFinal);
            Assert.Equal("PENDIENTE", resultado.Estado);
        }

        [Fact]
        public void Ejecutar_DeberiaLanzarExcepcion_CuandoNoExisteCuota()
        {
            var repoCuotaMock = new Mock<IRepositorioCuota>();

            repoCuotaMock
                .Setup(r => r.ObtenerPorAlumnoMesYAnio(
                    3,
                    DateTime.Now.Month,
                    DateTime.Now.Year))
                .Returns((Entidades.Cuota)null);

            var casoUso =
                new ObtenerCuotaActualAlumno(repoCuotaMock.Object);

            Assert.Throws<LogicaNegocioException>(() =>
                casoUso.Ejecutar(3));
        }
    }
}