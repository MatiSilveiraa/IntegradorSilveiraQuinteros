using Joki.LogicaAplicacion.CasosDeUso.Historial;
using Joki.LogicaNegocio.Enums;
using Joki.LogicaNegocio.InterfacesRepositorio;
using Moq;

using Entidades = Joki.LogicaNegocio.Entidades;

namespace Joki.Pruebas.CasosDeUso.Historial
{
    public class ObtenerMiHistorialTests
    {
        [Fact]
        public void Ejecutar_DeberiaRetornarHistorialDelAlumno()
        {
            var repoCuotaMock = new Mock<IRepositorioCuota>();
            var repoPagoMock = new Mock<IRepositorioPago>();
            var repoAsistenciaMock = new Mock<IRepositorioAsistencia>();

            repoCuotaMock
                .Setup(r => r.ObtenerPorAlumno(1))
                .Returns(new List<Entidades.Cuota>
                {
                    new Entidades.Cuota
                    {
                        Id = 1,
                        AlumnoId = 1,
                        Mes = 6,
                        Anio = 2026,
                        MontoFinal = 1390m,
                        Estado = EstadoCuota.PENDIENTE
                    }
                });

            repoPagoMock
                .Setup(r => r.ObtenerPorAlumno(1))
                .Returns(new List<Entidades.Pago>
                {
                    new Entidades.Pago
                    {
                        Id = 1,
                        CuotaId = 1,
                        MedioPago = MedioPago.EFECTIVO,
                        FechaPago = DateTime.Now,
                        Monto = 1390m,
                        Estado = EstadoPago.APROBADO,
                        ReferenciaExterna = "Pago efectivo"
                    }
                });

            repoAsistenciaMock
                .Setup(r => r.ObtenerPorAlumno(1))
                .Returns(new List<Entidades.Asistencia>
                {
                    new Entidades.Asistencia
                    {
                        Id = 1,
                        AlumnoId = 1,
                        ClaseId = 2,
                        Fecha = DateTime.Now,
                        Presente = true
                    }
                });

            var casoUso =
                new ObtenerMiHistorial(
                    repoCuotaMock.Object,
                    repoPagoMock.Object,
                    repoAsistenciaMock.Object);

            var resultado =
                casoUso.Ejecutar(1);

            Assert.Single(resultado.Cuotas);
            Assert.Single(resultado.Pagos);
            Assert.Single(resultado.Asistencias);

            Assert.Equal(1390m, resultado.Cuotas.First().MontoFinal);
            Assert.Equal("PENDIENTE", resultado.Cuotas.First().Estado);

            Assert.Equal("EFECTIVO", resultado.Pagos.First().MedioPago);
            Assert.Equal("APROBADO", resultado.Pagos.First().Estado);

            Assert.Equal(2, resultado.Asistencias.First().ClaseId);
        }

        [Fact]
        public void Ejecutar_DeberiaRetornarHistorialVacio_CuandoAlumnoNoTieneDatos()
        {
            var repoCuotaMock = new Mock<IRepositorioCuota>();
            var repoPagoMock = new Mock<IRepositorioPago>();
            var repoAsistenciaMock = new Mock<IRepositorioAsistencia>();

            repoCuotaMock
                .Setup(r => r.ObtenerPorAlumno(1))
                .Returns(new List<Entidades.Cuota>());

            repoPagoMock
                .Setup(r => r.ObtenerPorAlumno(1))
                .Returns(new List<Entidades.Pago>());

            repoAsistenciaMock
                .Setup(r => r.ObtenerPorAlumno(1))
                .Returns(new List<Entidades.Asistencia>());

            var casoUso =
                new ObtenerMiHistorial(
                    repoCuotaMock.Object,
                    repoPagoMock.Object,
                    repoAsistenciaMock.Object);

            var resultado =
                casoUso.Ejecutar(1);

            Assert.Empty(resultado.Cuotas);
            Assert.Empty(resultado.Pagos);
            Assert.Empty(resultado.Asistencias);
        }
    }
}