using Joki.LogicaAplicacion.CasosDeUso.Cuota;
using Joki.LogicaNegocio.Enums;
using Joki.LogicaNegocio.InterfacesRepositorio;
using Moq;
using Entidades = Joki.LogicaNegocio.Entidades;

namespace Joki.Pruebas.CasosDeUso.Cuota
{
    public class GenerarCuotasMensualesTests
    {
        private Mock<IRepositorioConfiguracionCuota> CrearRepoConfiguracionCuotaMock()
        {
            var repoConfiguracionCuotaMock =
                new Mock<IRepositorioConfiguracionCuota>();

            repoConfiguracionCuotaMock
                .Setup(r => r.ObtenerActiva())
                .Returns(new Entidades.ConfiguracionCuota
                {
                    MontoMensual = 1390m,
                    Activa = true
                });

            return repoConfiguracionCuotaMock;
        }

        private Mock<IRepositorioBeneficio> CrearRepoBeneficioMock()
        {
            var repoBeneficioMock =
                new Mock<IRepositorioBeneficio>();

            repoBeneficioMock
                .Setup(r => r.ObtenerPendientesPorAlumno(
                    It.IsAny<int>()))
                .Returns(new List<Entidades.Beneficio>());

            return repoBeneficioMock;
        }

        [Fact]
        public void Ejecutar_DeberiaGenerarCuotasParaAlumnosActivosSinCuota()
        {
            var repoAlumnoMock = new Mock<IRepositorioAlumno>();
            var repoCuotaMock = new Mock<IRepositorioCuota>();
            var repoConfiguracionCuotaMock =
                CrearRepoConfiguracionCuotaMock();
            var repoBeneficioMock =
                CrearRepoBeneficioMock();

            var alumnos = new List<Entidades.Alumno>
            {
                new Entidades.Alumno { UsuarioId = 1 },
                new Entidades.Alumno { UsuarioId = 2 }
            };

            repoAlumnoMock
                .Setup(r => r.ObtenerActivos())
                .Returns(alumnos);

            repoCuotaMock
                .Setup(r => r.ObtenerPorAlumnoMesYAnio(
                    It.IsAny<int>(),
                    It.IsAny<int>(),
                    It.IsAny<int>()))
                .Returns((Entidades.Cuota)null);

            var casoUso =
                new GenerarCuotasMensuales(
                    repoAlumnoMock.Object,
                    repoCuotaMock.Object,
                    repoConfiguracionCuotaMock.Object,
                    repoBeneficioMock.Object);

            casoUso.Ejecutar();

            repoCuotaMock.Verify(r => r.Agregar(
                It.Is<Entidades.Cuota>(c =>
                    c.MontoBase == 1390m &&
                    c.Descuento == 0m &&
                    c.MontoFinal == 1390m &&
                    c.Estado == EstadoCuota.PENDIENTE
                )), Times.Exactly(2));
        }

        [Fact]
        public void Ejecutar_NoDeberiaDuplicarCuotas_CuandoYaExisten()
        {
            var repoAlumnoMock = new Mock<IRepositorioAlumno>();
            var repoCuotaMock = new Mock<IRepositorioCuota>();
            var repoConfiguracionCuotaMock =
                CrearRepoConfiguracionCuotaMock();
            var repoBeneficioMock =
                CrearRepoBeneficioMock();

            var alumnos = new List<Entidades.Alumno>
            {
                new Entidades.Alumno { UsuarioId = 1 }
            };

            repoAlumnoMock
                .Setup(r => r.ObtenerActivos())
                .Returns(alumnos);

            repoCuotaMock
                .Setup(r => r.ObtenerPorAlumnoMesYAnio(
                    1,
                    It.IsAny<int>(),
                    It.IsAny<int>()))
                .Returns(new Entidades.Cuota
                {
                    AlumnoId = 1,
                    Mes = DateTime.Now.Month,
                    Anio = DateTime.Now.Year
                });

            var casoUso =
                new GenerarCuotasMensuales(
                    repoAlumnoMock.Object,
                    repoCuotaMock.Object,
                    repoConfiguracionCuotaMock.Object,
                    repoBeneficioMock.Object);

            casoUso.Ejecutar();

            repoCuotaMock.Verify(r => r.Agregar(
                It.IsAny<Entidades.Cuota>()), Times.Never);
        }

        [Fact]
        public void Ejecutar_NoDeberiaGenerarCuotas_CuandoNoHayAlumnosActivos()
        {
            var repoAlumnoMock = new Mock<IRepositorioAlumno>();
            var repoCuotaMock = new Mock<IRepositorioCuota>();
            var repoConfiguracionCuotaMock =
                CrearRepoConfiguracionCuotaMock();
            var repoBeneficioMock =
                CrearRepoBeneficioMock();

            repoAlumnoMock
                .Setup(r => r.ObtenerActivos())
                .Returns(new List<Entidades.Alumno>());

            var casoUso =
                new GenerarCuotasMensuales(
                    repoAlumnoMock.Object,
                    repoCuotaMock.Object,
                    repoConfiguracionCuotaMock.Object,
                    repoBeneficioMock.Object);

            casoUso.Ejecutar();

            repoCuotaMock.Verify(r => r.Agregar(
                It.IsAny<Entidades.Cuota>()), Times.Never);
        }

        [Fact]
        public void Ejecutar_DeberiaAplicarDescuento_CuandoAlumnoTieneBeneficio()
        {
            var repoAlumnoMock = new Mock<IRepositorioAlumno>();
            var repoCuotaMock = new Mock<IRepositorioCuota>();
            var repoConfiguracionCuotaMock =
                CrearRepoConfiguracionCuotaMock();
            var repoBeneficioMock =
                new Mock<IRepositorioBeneficio>();

            var alumnos = new List<Entidades.Alumno>
            {
                new Entidades.Alumno { UsuarioId = 1 }
            };

            var beneficio = new Entidades.Beneficio
            {
                AlumnoId = 1,
                MesesDuracion = 1,
                MesesAplicados = 0,
                Estado = EstadoBeneficio.PENDIENTE,
                Descuento = new Entidades.Descuento
                {
                    Porcentaje = 20m,
                    Activo = true
                }
            };

            repoAlumnoMock
                .Setup(r => r.ObtenerActivos())
                .Returns(alumnos);

            repoCuotaMock
                .Setup(r => r.ObtenerPorAlumnoMesYAnio(
                    It.IsAny<int>(),
                    It.IsAny<int>(),
                    It.IsAny<int>()))
                .Returns((Entidades.Cuota)null);

            repoBeneficioMock
                .Setup(r => r.ObtenerPendientesPorAlumno(1))
                .Returns(new List<Entidades.Beneficio>
                {
                    beneficio
                });

            var casoUso =
                new GenerarCuotasMensuales(
                    repoAlumnoMock.Object,
                    repoCuotaMock.Object,
                    repoConfiguracionCuotaMock.Object,
                    repoBeneficioMock.Object);

            casoUso.Ejecutar();

            repoCuotaMock.Verify(r => r.Agregar(
                It.Is<Entidades.Cuota>(c =>
                    c.MontoBase == 1390m &&
                    c.Descuento == 278m &&
                    c.MontoFinal == 1112m
                )), Times.Once);

            repoBeneficioMock.Verify(r => r.Modificar(
                It.Is<Entidades.Beneficio>(b =>
                    b.MesesAplicados == 1 &&
                    b.Estado == EstadoBeneficio.OTORGADO
                )), Times.Once);
        }
    }
}