using Joki.CasoUsoCompartida.DTOs.Grupo;
using Joki.LogicaAplicacion.CasosDeUso.Grupo;
using Joki.LogicaNegocio.Enums;
using Joki.LogicaNegocio.Excepciones;
using Joki.LogicaNegocio.InterfacesRepositorio;
using Moq;

namespace Joki.Pruebas.CasosDeUso.Grupo
{
    public class GrupoTests
    {
        [Fact]
        public void CrearGrupo_DeberiaCrearGrupo_CuandoDatosSonValidos()
        {
            var mockRepo = new Mock<IRepositorioGrupo>();

            var request = new CrearGrupoRequest
            {
                Nombre = "Funcional Noche",
                Nivel = "Intermedio",
                CupoMaximo = 20,
                DiaSemana = "Lunes",
                HoraInicio = new TimeSpan(19, 0, 0),
                HoraFin = new TimeSpan(20, 0, 0),
                Latitud = -34.90m,
                Longitud = -56.16m,
                CodigoPostal = "11000",
                RadioGeolocalizacion = 100,
                EsFijo = true,
                FechaInicio = DateTime.Now,
                FechaFin = DateTime.Now.AddMonths(3),
                EntrenadorId = 1
            };

            mockRepo.Setup(r => r.Agregar(It.IsAny<Joki.LogicaNegocio.Entidades.Grupo>()))
                .Returns((Joki.LogicaNegocio.Entidades.Grupo grupo) =>
                {
                    grupo.Id = 1;
                    return grupo;
                });

            var casoUso = new CrearGrupo(mockRepo.Object);

            var resultado = casoUso.Ejecutar(request);

            Assert.NotNull(resultado);
            Assert.Equal(1, resultado.Id);
            Assert.Equal("Funcional Noche", resultado.Nombre);
            Assert.Equal("Intermedio", resultado.Nivel);
            Assert.Equal(20, resultado.CupoMaximo);
            Assert.Equal("Lunes", resultado.DiaSemana);
            Assert.Equal(new TimeSpan(19, 0, 0), resultado.HoraInicio);
            Assert.Equal(new TimeSpan(20, 0, 0), resultado.HoraFin);
            Assert.Equal(-34.90m, resultado.Latitud);
            Assert.Equal(-56.16m, resultado.Longitud);
            Assert.Equal("11000", resultado.CodigoPostal);
            Assert.Equal(100, resultado.RadioGeolocalizacion);
            Assert.True(resultado.EsFijo);
            Assert.Equal("ACTIVO", resultado.Estado);
            Assert.Equal(1, resultado.EntrenadorId);

            mockRepo.Verify(r => r.Agregar(It.IsAny<Joki.LogicaNegocio.Entidades.Grupo>()), Times.Once);
        }

        [Fact]
        public void ObtenerGrupos_DeberiaRetornarTodosLosGrupos()
        {
            var mockRepo = new Mock<IRepositorioGrupo>();

            var grupos = new List<Joki.LogicaNegocio.Entidades.Grupo>
            {
                new Joki.LogicaNegocio.Entidades.Grupo
                {
                    Id = 1,
                    Nombre = "Funcional Mañana",
                    Nivel = "Inicial",
                    CupoMaximo = 15,
                    DiaSemana = DiaSemana.Lunes,
                    HoraInicio = new TimeSpan(9, 0, 0),
                    HoraFin = new TimeSpan(10, 0, 0),
                    RadioGeolocalizacion = 100,
                    EsFijo = true,
                    FechaInicio = DateTime.Now,
                    FechaFin = DateTime.Now.AddMonths(3),
                    Estado = EstadoGrupo.ACTIVO,
                    EntrenadorId = 1
                },
                new Joki.LogicaNegocio.Entidades.Grupo
                {
                    Id = 2,
                    Nombre = "Funcional Noche",
                    Nivel = "Avanzado",
                    CupoMaximo = 20,
                    DiaSemana = DiaSemana.Martes,
                    HoraInicio = new TimeSpan(19, 0, 0),
                    HoraFin = new TimeSpan(20, 0, 0),
                    RadioGeolocalizacion = 100,
                    EsFijo = true,
                    FechaInicio = DateTime.Now,
                    FechaFin = DateTime.Now.AddMonths(3),
                    Estado = EstadoGrupo.ACTIVO,
                    EntrenadorId = 1
                }
            };

            mockRepo.Setup(r => r.ObtenerTodos()).Returns(grupos);

            var casoUso = new ObtenerGrupos(mockRepo.Object);

            var resultado = casoUso.Ejecutar().ToList();

            Assert.NotNull(resultado);
            Assert.Equal(2, resultado.Count);
            Assert.Equal("Funcional Mañana", resultado[0].Nombre);
            Assert.Equal("Funcional Noche", resultado[1].Nombre);

            mockRepo.Verify(r => r.ObtenerTodos(), Times.Once);
        }

        [Fact]
        public void ObtenerGrupos_DeberiaRetornarListaVacia_CuandoNoHayGrupos()
        {
            var mockRepo = new Mock<IRepositorioGrupo>();

            mockRepo.Setup(r => r.ObtenerTodos())
                .Returns(new List<Joki.LogicaNegocio.Entidades.Grupo>());

            var casoUso = new ObtenerGrupos(mockRepo.Object);

            var resultado = casoUso.Ejecutar().ToList();

            Assert.NotNull(resultado);
            Assert.Empty(resultado);

            mockRepo.Verify(r => r.ObtenerTodos(), Times.Once);
        }

        [Fact]
        public void ObtenerGrupoPorId_DeberiaRetornarGrupo_CuandoExiste()
        {
            var mockRepo = new Mock<IRepositorioGrupo>();

            var grupo = new Joki.LogicaNegocio.Entidades.Grupo
            {
                Id = 1,
                Nombre = "Funcional Mañana",
                Nivel = "Inicial",
                CupoMaximo = 15,
                DiaSemana = DiaSemana.Lunes,
                HoraInicio = new TimeSpan(9, 0, 0),
                HoraFin = new TimeSpan(10, 0, 0),
                RadioGeolocalizacion = 100,
                EsFijo = true,
                FechaInicio = DateTime.Now,
                FechaFin = DateTime.Now.AddMonths(3),
                Estado = EstadoGrupo.ACTIVO,
                EntrenadorId = 1
            };

            mockRepo.Setup(r => r.ObtenerPorId(1)).Returns(grupo);

            var casoUso = new ObtenerGrupoPorId(mockRepo.Object);

            var resultado = casoUso.Ejecutar(1);

            Assert.NotNull(resultado);
            Assert.Equal(1, resultado.Id);
            Assert.Equal("Funcional Mañana", resultado.Nombre);
            Assert.Equal("Inicial", resultado.Nivel);
            Assert.Equal("Lunes", resultado.DiaSemana);

            mockRepo.Verify(r => r.ObtenerPorId(1), Times.Once);
        }

        [Fact]
        public void ObtenerGrupoPorId_DeberiaLanzarExcepcion_CuandoNoExiste()
        {
            var mockRepo = new Mock<IRepositorioGrupo>();

            mockRepo.Setup(r => r.ObtenerPorId(99))
                .Returns((Joki.LogicaNegocio.Entidades.Grupo?)null);

            var casoUso = new ObtenerGrupoPorId(mockRepo.Object);

            var exception = Assert.Throws<LogicaNegocioException>(() => casoUso.Ejecutar(99));

            Assert.Equal("El grupo solicitado no existe.", exception.Message);

            mockRepo.Verify(r => r.ObtenerPorId(99), Times.Once);
        }

        [Fact]
        public void EditarGrupo_DeberiaEditarGrupo_CuandoExiste()
        {
            var mockRepo = new Mock<IRepositorioGrupo>();

            var grupo = new Joki.LogicaNegocio.Entidades.Grupo
            {
                Id = 1,
                Nombre = "Funcional Viejo",
                Nivel = "Inicial",
                CupoMaximo = 10,
                DiaSemana = DiaSemana.Lunes,
                HoraInicio = new TimeSpan(8, 0, 0),
                HoraFin = new TimeSpan(9, 0, 0),
                RadioGeolocalizacion = 50,
                EsFijo = true,
                FechaInicio = DateTime.Now,
                FechaFin = DateTime.Now.AddMonths(1),
                Estado = EstadoGrupo.ACTIVO,
                EntrenadorId = 1
            };

            var request = new EditarGrupoRequest
            {
                Nombre = "Funcional Editado",
                Nivel = "Avanzado",
                CupoMaximo = 25,
                DiaSemana = "Martes",
                HoraInicio = new TimeSpan(19, 0, 0),
                HoraFin = new TimeSpan(20, 0, 0),
                Latitud = -34.90m,
                Longitud = -56.16m,
                CodigoPostal = "11000",
                RadioGeolocalizacion = 100,
                EsFijo = true,
                FechaInicio = DateTime.Now,
                FechaFin = DateTime.Now.AddMonths(3),
                EntrenadorId = 2
            };

            mockRepo.Setup(r => r.ObtenerPorId(1)).Returns(grupo);

            var casoUso = new EditarGrupo(mockRepo.Object);

            var resultado = casoUso.Ejecutar(1, request);

            Assert.NotNull(resultado);
            Assert.Equal(1, resultado.Id);
            Assert.Equal("Funcional Editado", resultado.Nombre);
            Assert.Equal("Avanzado", resultado.Nivel);
            Assert.Equal(25, resultado.CupoMaximo);
            Assert.Equal("Martes", resultado.DiaSemana);
            Assert.Equal(new TimeSpan(19, 0, 0), resultado.HoraInicio);
            Assert.Equal(new TimeSpan(20, 0, 0), resultado.HoraFin);
            Assert.Equal(-34.90m, resultado.Latitud);
            Assert.Equal(-56.16m, resultado.Longitud);
            Assert.Equal("11000", resultado.CodigoPostal);
            Assert.Equal(100, resultado.RadioGeolocalizacion);
            Assert.True(resultado.EsFijo);
            Assert.Equal(2, resultado.EntrenadorId);

            mockRepo.Verify(r => r.ObtenerPorId(1), Times.Once);
            mockRepo.Verify(r => r.Actualizar(It.IsAny<Joki.LogicaNegocio.Entidades.Grupo>()), Times.Once);
        }

        [Fact]
        public void EditarGrupo_DeberiaLanzarExcepcion_CuandoNoExiste()
        {
            var mockRepo = new Mock<IRepositorioGrupo>();

            var request = new EditarGrupoRequest
            {
                Nombre = "Funcional Editado",
                Nivel = "Avanzado",
                CupoMaximo = 25,
                DiaSemana = "Martes",
                HoraInicio = new TimeSpan(19, 0, 0),
                HoraFin = new TimeSpan(20, 0, 0),
                Latitud = -34.90m,
                Longitud = -56.16m,
                CodigoPostal = "11000",
                RadioGeolocalizacion = 100,
                EsFijo = true,
                FechaInicio = DateTime.Now,
                FechaFin = DateTime.Now.AddMonths(3),
                EntrenadorId = 2
            };

            mockRepo.Setup(r => r.ObtenerPorId(99))
                .Returns((Joki.LogicaNegocio.Entidades.Grupo?)null);

            var casoUso = new EditarGrupo(mockRepo.Object);

            var exception = Assert.Throws<LogicaNegocioException>(() => casoUso.Ejecutar(99, request));

            Assert.Equal("El grupo solicitado no existe.", exception.Message);

            mockRepo.Verify(r => r.ObtenerPorId(99), Times.Once);
            mockRepo.Verify(r => r.Actualizar(It.IsAny<Joki.LogicaNegocio.Entidades.Grupo>()), Times.Never);
        }

        [Fact]
        public void EliminarGrupo_DeberiaEliminarGrupo_CuandoExiste()
        {
            var mockRepo = new Mock<IRepositorioGrupo>();

            var grupo = new Joki.LogicaNegocio.Entidades.Grupo
            {
                Id = 1,
                Nombre = "Funcional Mañana"
            };

            mockRepo.Setup(r => r.ObtenerPorId(1)).Returns(grupo);

            var casoUso = new EliminarGrupo(mockRepo.Object);

            casoUso.Ejecutar(1);

            mockRepo.Verify(r => r.ObtenerPorId(1), Times.Once);
            mockRepo.Verify(r => r.Eliminar(1), Times.Once);
        }

        [Fact]
        public void EliminarGrupo_DeberiaLanzarExcepcion_CuandoNoExiste()
        {
            var mockRepo = new Mock<IRepositorioGrupo>();

            mockRepo.Setup(r => r.ObtenerPorId(99))
                .Returns((Joki.LogicaNegocio.Entidades.Grupo?)null);

            var casoUso = new EliminarGrupo(mockRepo.Object);

            var exception = Assert.Throws<LogicaNegocioException>(() => casoUso.Ejecutar(99));

            Assert.Equal("El grupo solicitado no existe.", exception.Message);

            mockRepo.Verify(r => r.ObtenerPorId(99), Times.Once);
            mockRepo.Verify(r => r.Eliminar(99), Times.Never);
        }
    }
}
