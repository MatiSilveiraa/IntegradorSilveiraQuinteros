using Joki.LogicaAplicacion.CasosDeUso.Cuota;
using Joki.LogicaNegocio.Enums;
using Joki.LogicaNegocio.InterfacesRepositorio;
using Moq;
using Xunit;

using Entidades = Joki.LogicaNegocio.Entidades;

namespace Joki.Pruebas.CasosDeUso.Cuota
{
    public class ObtenerMisCuotasTests
    {
        [Fact]
        public void Ejecutar_DeberiaRetornarCuotasDelAlumno()
        {
            var repoCuotaMock = new Mock<IRepositorioCuota>();

            var cuotas = new List<Entidades.Cuota>
            {
                new Entidades.Cuota
                {
                    Id = 1,
                    AlumnoId = 3,
                    Mes = 5,
                    Anio = 2026,
                    MontoBase = 1390m,
                    Descuento = 139m,
                    MontoFinal = 1251m,
                    Estado = EstadoCuota.PENDIENTE
                },
                new Entidades.Cuota
                {
                    Id = 2,
                    AlumnoId = 3,
                    Mes = 4,
                    Anio = 2026,
                    MontoBase = 1390m,
                    Descuento = 0m,
                    MontoFinal = 1390m,
                    Estado = EstadoCuota.PAGADA
                }
            };

            repoCuotaMock
                .Setup(r => r.ObtenerPorAlumno(3))
                .Returns(cuotas);

            var casoUso =
                new ObtenerMisCuotas(repoCuotaMock.Object);

            var resultado =
                casoUso.Ejecutar(3).ToList();

            Assert.Equal(2, resultado.Count);

            Assert.Equal(1, resultado[0].Id);
            Assert.Equal(3, resultado[0].AlumnoId);
            Assert.Equal(1390m, resultado[0].MontoBase);
            Assert.Equal(139m, resultado[0].Descuento);
            Assert.Equal(1251m, resultado[0].MontoFinal);
            Assert.Equal("PENDIENTE", resultado[0].Estado);

            Assert.Equal(2, resultado[1].Id);
            Assert.Equal("PAGADA", resultado[1].Estado);
        }

        [Fact]
        public void Ejecutar_DeberiaRetornarListaVacia_CuandoAlumnoNoTieneCuotas()
        {
            var repoCuotaMock = new Mock<IRepositorioCuota>();

            repoCuotaMock
                .Setup(r => r.ObtenerPorAlumno(3))
                .Returns(new List<Entidades.Cuota>());

            var casoUso =
                new ObtenerMisCuotas(repoCuotaMock.Object);

            var resultado =
                casoUso.Ejecutar(3).ToList();

            Assert.Empty(resultado);
        }
    }
}