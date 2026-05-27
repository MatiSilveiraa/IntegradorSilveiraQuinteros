using Joki.LogicaAplicacion.CasosDeUso.Cuota;
using Joki.LogicaNegocio.Enums;
using Joki.LogicaNegocio.InterfacesRepositorio;
using Moq;
using Entidades = Joki.LogicaNegocio.Entidades;

namespace Joki.Pruebas.CasosDeUso.Cuota
{
    public class GenerarCuotasMensualesTests
    {
        [Fact]
        public void Ejecutar_DeberiaGenerarCuotasParaAlumnosActivosSinCuota()
        {
            var repoAlumnoMock = new Mock<IRepositorioAlumno>();
            var repoCuotaMock = new Mock<IRepositorioCuota>();

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
                    repoCuotaMock.Object);

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
                    repoCuotaMock.Object);

            casoUso.Ejecutar();

            repoCuotaMock.Verify(r => r.Agregar(
                It.IsAny<Entidades.Cuota>()), Times.Never);
        }

        [Fact]
        public void Ejecutar_NoDeberiaGenerarCuotas_CuandoNoHayAlumnosActivos()
        {
            var repoAlumnoMock = new Mock<IRepositorioAlumno>();
            var repoCuotaMock = new Mock<IRepositorioCuota>();

            repoAlumnoMock
                .Setup(r => r.ObtenerActivos())
                .Returns(new List<Entidades.Alumno>());

            var casoUso =
                new GenerarCuotasMensuales(
                    repoAlumnoMock.Object,
                    repoCuotaMock.Object);

            casoUso.Ejecutar();

            repoCuotaMock.Verify(r => r.Agregar(
                It.IsAny<Entidades.Cuota>()), Times.Never);
        }
    }
}