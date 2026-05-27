using Joki.CasoUsoCompartida.DTOs.Asistencia;
using Joki.LogicaAplicacion.CasosDeUso.GestionAsistencias;
using Joki.LogicaNegocio.Excepciones;
using Joki.LogicaNegocio.InterfacesRepositorio;
using Moq;
using Entidades = Joki.LogicaNegocio.Entidades;

namespace Joki.Pruebas.CasosDeUso.Asistencia
{
    public class RegistrarAsistenciaTests
    {
        private readonly Mock<IRepositorioAsistencia> _repoAsistenciaMock;
        private readonly Mock<IRepositorioClase> _repoClaseMock;
        private readonly Mock<IRepositorioAlumno> _repoAlumnoMock;
        private readonly Mock<IRepositorioCuota> _repoCuotaMock;

        private readonly RegistrarAsistencia _casoUso;

        public RegistrarAsistenciaTests()
        {
            _repoAsistenciaMock = new Mock<IRepositorioAsistencia>();
            _repoClaseMock = new Mock<IRepositorioClase>();
            _repoAlumnoMock = new Mock<IRepositorioAlumno>();
            _repoCuotaMock = new Mock<IRepositorioCuota>();

            _casoUso = new RegistrarAsistencia(
                _repoAsistenciaMock.Object,
                _repoClaseMock.Object,
                _repoAlumnoMock.Object
                , _repoCuotaMock.Object
            );
        }

        [Fact]
        public void Ejecutar_DeberiaRegistrarAsistencia_CuandoDatosSonValidos()
        {
            RegistrarAsistenciaRequest request = new RegistrarAsistenciaRequest
            {
                AlumnoId = 1,
                ClaseId = 1,
                Presente = true
            };

            _repoAlumnoMock
                .Setup(r => r.ObtenerPorId(1))
                .Returns(new Entidades.Alumno());

            _repoClaseMock
                .Setup(r => r.ObtenerPorId(1))
                .Returns(new Entidades.Clase());

            _repoAsistenciaMock
                .Setup(r => r.ExisteAsistencia(1, 1, It.IsAny<DateTime>()))
                .Returns(false);

            _casoUso.Ejecutar(request, 2);

            _repoAsistenciaMock.Verify(r => r.Agregar(
                It.Is<Entidades.Asistencia>(a =>
                    a.AlumnoId == 1 &&
                    a.ClaseId == 1 &&
                    a.Presente == true &&
                    a.RegistradoPorId == 2
                )), Times.Once);
        }

        [Fact]
        public void Ejecutar_DeberiaLanzarExcepcion_CuandoRequestEsNulo()
        {
            LogicaNegocioException ex = Assert.Throws<LogicaNegocioException>(() =>
                _casoUso.Ejecutar(null, 2)
            );

            Assert.Equal(
                "Los datos de asistencia no pueden ser nulos",
                ex.Message);

            _repoAsistenciaMock.Verify(r => r.Agregar(
                It.IsAny<Entidades.Asistencia>()), Times.Never);
        }

        [Fact]
        public void Ejecutar_DeberiaLanzarExcepcion_CuandoAlumnoNoExiste()
        {
            RegistrarAsistenciaRequest request = new RegistrarAsistenciaRequest
            {
                AlumnoId = 99,
                ClaseId = 1,
                Presente = true
            };

            _repoAlumnoMock
                .Setup(r => r.ObtenerPorId(99))
                .Returns((Entidades.Alumno)null);

            LogicaNegocioException ex = Assert.Throws<LogicaNegocioException>(() =>
                _casoUso.Ejecutar(request, 2)
            );

            Assert.Equal(
                "Alumno no encontrado",
                ex.Message);

            _repoAsistenciaMock.Verify(r => r.Agregar(
                It.IsAny<Entidades.Asistencia>()), Times.Never);
        }

        [Fact]
        public void Ejecutar_DeberiaLanzarExcepcion_CuandoClaseNoExiste()
        {
            RegistrarAsistenciaRequest request = new RegistrarAsistenciaRequest
            {
                AlumnoId = 1,
                ClaseId = 99,
                Presente = true
            };

            _repoAlumnoMock
                .Setup(r => r.ObtenerPorId(1))
                .Returns(new Entidades.Alumno());

            _repoClaseMock
                .Setup(r => r.ObtenerPorId(99))
                .Returns((Entidades.Clase)null);

            LogicaNegocioException ex = Assert.Throws<LogicaNegocioException>(() =>
                _casoUso.Ejecutar(request, 2)
            );

            Assert.Equal(
                "Clase no encontrada",
                ex.Message);

            _repoAsistenciaMock.Verify(r => r.Agregar(
                It.IsAny<Entidades.Asistencia>()), Times.Never);
        }

        [Fact]
        public void Ejecutar_DeberiaLanzarExcepcion_CuandoAsistenciaYaExiste()
        {
            RegistrarAsistenciaRequest request = new RegistrarAsistenciaRequest
            {
                AlumnoId = 1,
                ClaseId = 1,
                Presente = true
            };

            _repoAlumnoMock
                .Setup(r => r.ObtenerPorId(1))
                .Returns(new Entidades.Alumno());

            _repoClaseMock
                .Setup(r => r.ObtenerPorId(1))
                .Returns(new Entidades.Clase());

            _repoAsistenciaMock
                .Setup(r => r.ExisteAsistencia(
                    1,
                    1,
                    It.IsAny<DateTime>()))
                .Returns(true);

            LogicaNegocioException ex = Assert.Throws<LogicaNegocioException>(() =>
                _casoUso.Ejecutar(request, 2)
            );

            Assert.Equal(
                "La asistencia ya fue registrada",
                ex.Message);

            _repoAsistenciaMock.Verify(r => r.Agregar(
                It.IsAny<Entidades.Asistencia>()), Times.Never);
        }

        [Fact]
        public void Ejecutar_DeberiaBloquearAlumno_CuandoTieneCincoFaltasConsecutivas()
        {
            RegistrarAsistenciaRequest request = new RegistrarAsistenciaRequest
            {
                AlumnoId = 1,
                ClaseId = 1,
                Presente = false
            };

            Entidades.Alumno alumno = new Entidades.Alumno
            {
                BloqueadoPorInasistencias = false
            };

            _repoAlumnoMock
                .Setup(r => r.ObtenerPorId(1))
                .Returns(alumno);

            _repoClaseMock
                .Setup(r => r.ObtenerPorId(1))
                .Returns(new Entidades.Clase());

            _repoAsistenciaMock
                .Setup(r => r.ExisteAsistencia(1, 1, It.IsAny<DateTime>()))
                .Returns(false);

            _repoAsistenciaMock
                .Setup(r => r.ObtenerUltimasAsistencias(1, 5))
                .Returns(new List<Entidades.Asistencia>
                {
            new Entidades.Asistencia { Presente = false },
            new Entidades.Asistencia { Presente = false },
            new Entidades.Asistencia { Presente = false },
            new Entidades.Asistencia { Presente = false },
            new Entidades.Asistencia { Presente = false }
                });

            _casoUso.Ejecutar(request, 2);

            Assert.True(alumno.BloqueadoPorInasistencias);

            _repoAlumnoMock.Verify(
    r => r.Modificar(alumno),
    Times.AtLeastOnce);
        }

        [Fact]
        public void Ejecutar_NoDeberiaBloquearAlumno_CuandoNoTieneCincoFaltasConsecutivas()
        {
            RegistrarAsistenciaRequest request = new RegistrarAsistenciaRequest
            {
                AlumnoId = 1,
                ClaseId = 1,
                Presente = false
            };

            Entidades.Alumno alumno = new Entidades.Alumno
            {
                BloqueadoPorInasistencias = false
            };

            _repoAlumnoMock
                .Setup(r => r.ObtenerPorId(1))
                .Returns(alumno);

            _repoClaseMock
                .Setup(r => r.ObtenerPorId(1))
                .Returns(new Entidades.Clase());

            _repoAsistenciaMock
                .Setup(r => r.ExisteAsistencia(1, 1, It.IsAny<DateTime>()))
                .Returns(false);

            _repoAsistenciaMock
                .Setup(r => r.ObtenerUltimasAsistencias(1, 5))
                .Returns(new List<Entidades.Asistencia>
                {
            new Entidades.Asistencia { Presente = false },
            new Entidades.Asistencia { Presente = false },
            new Entidades.Asistencia { Presente = true },
            new Entidades.Asistencia { Presente = false },
            new Entidades.Asistencia { Presente = false }
                });

            _casoUso.Ejecutar(request, 2);

            Assert.False(alumno.BloqueadoPorInasistencias);

            
        }

        [Fact]
        public void Ejecutar_DeberiaAumentarRacha_CuandoAlumnoEstaPresente()
        {
            RegistrarAsistenciaRequest request = new RegistrarAsistenciaRequest
            {
                AlumnoId = 1,
                ClaseId = 1,
                Presente = true
            };

            Entidades.Alumno alumno = new Entidades.Alumno
            {
                RachaAsistenciaMensual = 3,
                MesRachaAsistencia = DateTime.Now.Month,
                AnioRachaAsistencia = DateTime.Now.Year,
                DescuentoRachaGenerado = false
            };

            _repoAlumnoMock
                .Setup(r => r.ObtenerPorId(1))
                .Returns(alumno);

            _repoClaseMock
                .Setup(r => r.ObtenerPorId(1))
                .Returns(new Entidades.Clase());

            _repoAsistenciaMock
                .Setup(r => r.ExisteAsistencia(1, 1, It.IsAny<DateTime>()))
                .Returns(false);

            _casoUso.Ejecutar(request, 2);

            Assert.Equal(4, alumno.RachaAsistenciaMensual);

            _repoAlumnoMock.Verify(r => r.Modificar(alumno), Times.Once);
        }

        [Fact]
        public void Ejecutar_DeberiaReiniciarRacha_CuandoAlumnoEstaAusente()
        {
            RegistrarAsistenciaRequest request = new RegistrarAsistenciaRequest
            {
                AlumnoId = 1,
                ClaseId = 1,
                Presente = false
            };

            Entidades.Alumno alumno = new Entidades.Alumno
            {
                RachaAsistenciaMensual = 4,
                MesRachaAsistencia = DateTime.Now.Month,
                AnioRachaAsistencia = DateTime.Now.Year,
                DescuentoRachaGenerado = false
            };

            _repoAlumnoMock
                .Setup(r => r.ObtenerPorId(1))
                .Returns(alumno);

            _repoClaseMock
                .Setup(r => r.ObtenerPorId(1))
                .Returns(new Entidades.Clase());

            _repoAsistenciaMock
                .Setup(r => r.ExisteAsistencia(1, 1, It.IsAny<DateTime>()))
                .Returns(false);

            _repoAsistenciaMock
                .Setup(r => r.ObtenerUltimasAsistencias(1, 5))
                .Returns(new List<Entidades.Asistencia>
                {
            new Entidades.Asistencia { Presente = false }
                });

            _casoUso.Ejecutar(request, 2);

            Assert.Equal(0, alumno.RachaAsistenciaMensual);

            _repoAlumnoMock.Verify(r => r.Modificar(alumno), Times.Once);
        }

        [Fact]
        public void Ejecutar_DeberiaGenerarDescuento_CuandoRachaLlegaADiez()
        {
            RegistrarAsistenciaRequest request = new RegistrarAsistenciaRequest
            {
                AlumnoId = 1,
                ClaseId = 1,
                Presente = true
            };

            Entidades.Alumno alumno = new Entidades.Alumno
            {
                RachaAsistenciaMensual = 9,
                MesRachaAsistencia = DateTime.Now.Month,
                AnioRachaAsistencia = DateTime.Now.Year,
                DescuentoRachaGenerado = false
            };

            _repoAlumnoMock
                .Setup(r => r.ObtenerPorId(1))
                .Returns(alumno);

            _repoClaseMock
                .Setup(r => r.ObtenerPorId(1))
                .Returns(new Entidades.Clase());

            _repoAsistenciaMock
                .Setup(r => r.ExisteAsistencia(1, 1, It.IsAny<DateTime>()))
                .Returns(false);

            _casoUso.Ejecutar(request, 2);

            Assert.Equal(10, alumno.RachaAsistenciaMensual);
            Assert.True(alumno.DescuentoRachaGenerado);

            _repoAlumnoMock.Verify(r => r.Modificar(alumno), Times.Once);
        }

        [Fact]
        public void Ejecutar_DeberiaAumentarRachaMensual_CuandoAlumnoEstaPresente()
        {
            RegistrarAsistenciaRequest request = new RegistrarAsistenciaRequest
            {
                AlumnoId = 1,
                ClaseId = 1,
                Presente = true
            };

            Entidades.Alumno alumno = new Entidades.Alumno
            {
                RachaAsistenciaMensual = 3,
                MesRachaAsistencia = DateTime.Now.Month,
                AnioRachaAsistencia = DateTime.Now.Year,
                DescuentoRachaGenerado = false
            };

            _repoAlumnoMock
                .Setup(r => r.ObtenerPorId(1))
                .Returns(alumno);

            _repoClaseMock
                .Setup(r => r.ObtenerPorId(1))
                .Returns(new Entidades.Clase());

            _repoAsistenciaMock
                .Setup(r => r.ExisteAsistencia(1, 1, It.IsAny<DateTime>()))
                .Returns(false);

            _casoUso.Ejecutar(request, 2);

            Assert.Equal(4, alumno.RachaAsistenciaMensual);
            Assert.False(alumno.DescuentoRachaGenerado);

            _repoAlumnoMock.Verify(
                r => r.Modificar(alumno),
                Times.Once);
        }

        [Fact]
        public void Ejecutar_DeberiaReiniciarRachaMensual_CuandoAlumnoEstaAusente()
        {
            RegistrarAsistenciaRequest request = new RegistrarAsistenciaRequest
            {
                AlumnoId = 1,
                ClaseId = 1,
                Presente = false
            };

            Entidades.Alumno alumno = new Entidades.Alumno
            {
                RachaAsistenciaMensual = 4,
                MesRachaAsistencia = DateTime.Now.Month,
                AnioRachaAsistencia = DateTime.Now.Year,
                DescuentoRachaGenerado = false
            };

            _repoAlumnoMock
                .Setup(r => r.ObtenerPorId(1))
                .Returns(alumno);

            _repoClaseMock
                .Setup(r => r.ObtenerPorId(1))
                .Returns(new Entidades.Clase());

            _repoAsistenciaMock
                .Setup(r => r.ExisteAsistencia(1, 1, It.IsAny<DateTime>()))
                .Returns(false);

            _repoAsistenciaMock
                .Setup(r => r.ObtenerUltimasAsistencias(1, 5))
                .Returns(new List<Entidades.Asistencia>
                {
            new Entidades.Asistencia { Presente = false }
                });

            _casoUso.Ejecutar(request, 2);

            Assert.Equal(0, alumno.RachaAsistenciaMensual);

            _repoAlumnoMock.Verify(
                r => r.Modificar(alumno),
                Times.Once);
        }

        [Fact]
        public void Ejecutar_DeberiaReiniciarRachaMensual_CuandoCambioElMes()
        {
            RegistrarAsistenciaRequest request = new RegistrarAsistenciaRequest
            {
                AlumnoId = 1,
                ClaseId = 1,
                Presente = true
            };

            Entidades.Alumno alumno = new Entidades.Alumno
            {
                RachaAsistenciaMensual = 8,
                MesRachaAsistencia = DateTime.Now.AddMonths(-1).Month,
                AnioRachaAsistencia = DateTime.Now.Year,
                DescuentoRachaGenerado = true
            };

            _repoAlumnoMock
                .Setup(r => r.ObtenerPorId(1))
                .Returns(alumno);

            _repoClaseMock
                .Setup(r => r.ObtenerPorId(1))
                .Returns(new Entidades.Clase());

            _repoAsistenciaMock
                .Setup(r => r.ExisteAsistencia(1, 1, It.IsAny<DateTime>()))
                .Returns(false);

            _casoUso.Ejecutar(request, 2);

            Assert.Equal(1, alumno.RachaAsistenciaMensual);
            Assert.Equal(DateTime.Now.Month, alumno.MesRachaAsistencia);
            Assert.Equal(DateTime.Now.Year, alumno.AnioRachaAsistencia);
            Assert.False(alumno.DescuentoRachaGenerado);

            _repoAlumnoMock.Verify(
                r => r.Modificar(alumno),
                Times.Once);
        }

        [Fact]
        public void Ejecutar_NoDeberiaCrearCuota_CuandoRachaLlegaADiezYNoExisteCuota()
        {
            RegistrarAsistenciaRequest request = new RegistrarAsistenciaRequest
            {
                AlumnoId = 1,
                ClaseId = 1,
                Presente = true
            };

            Entidades.Alumno alumno = new Entidades.Alumno
            {
                UsuarioId = 1,
                RachaAsistenciaMensual = 9,
                MesRachaAsistencia = DateTime.Now.Month,
                AnioRachaAsistencia = DateTime.Now.Year,
                DescuentoRachaGenerado = false
            };

            _repoAlumnoMock
                .Setup(r => r.ObtenerPorId(1))
                .Returns(alumno);

            _repoClaseMock
                .Setup(r => r.ObtenerPorId(1))
                .Returns(new Entidades.Clase());

            _repoAsistenciaMock
                .Setup(r => r.ExisteAsistencia(1, 1, It.IsAny<DateTime>()))
                .Returns(false);

            _repoCuotaMock
                .Setup(r => r.ObtenerPorAlumnoMesYAnio(
                    1,
                    It.IsAny<int>(),
                    It.IsAny<int>()))
                .Returns((Entidades.Cuota)null);

            _casoUso.Ejecutar(request, 2);

            Assert.Equal(10, alumno.RachaAsistenciaMensual);
            Assert.True(alumno.DescuentoRachaGenerado);

            _repoCuotaMock.Verify(r => r.Agregar(
                It.IsAny<Entidades.Cuota>()), Times.Never);

            _repoCuotaMock.Verify(r => r.Modificar(
                It.IsAny<Entidades.Cuota>()), Times.Never);
        }

        

        [Fact]
        public void Ejecutar_NoDeberiaAplicarDescuento_CuandoRachaNoLlegaADiez()
        {
            RegistrarAsistenciaRequest request = new RegistrarAsistenciaRequest
            {
                AlumnoId = 1,
                ClaseId = 1,
                Presente = true
            };

            Entidades.Alumno alumno = new Entidades.Alumno
            {
                UsuarioId = 1,
                RachaAsistenciaMensual = 8,
                MesRachaAsistencia = DateTime.Now.Month,
                AnioRachaAsistencia = DateTime.Now.Year,
                DescuentoRachaGenerado = false
            };

            _repoAlumnoMock
                .Setup(r => r.ObtenerPorId(1))
                .Returns(alumno);

            _repoClaseMock
                .Setup(r => r.ObtenerPorId(1))
                .Returns(new Entidades.Clase());

            _repoAsistenciaMock
                .Setup(r => r.ExisteAsistencia(1, 1, It.IsAny<DateTime>()))
                .Returns(false);

            _casoUso.Ejecutar(request, 2);

            _repoCuotaMock.Verify(r => r.Agregar(
                It.IsAny<Entidades.Cuota>()), Times.Never);

            _repoCuotaMock.Verify(r => r.Modificar(
                It.IsAny<Entidades.Cuota>()), Times.Never);

            Assert.False(alumno.DescuentoRachaGenerado);
        }
    }
}