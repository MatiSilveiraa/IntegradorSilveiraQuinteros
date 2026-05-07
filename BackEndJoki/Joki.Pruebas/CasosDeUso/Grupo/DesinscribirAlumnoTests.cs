using Joki.LogicaAplicacion.CasosDeUso.Grupo;
using Joki.LogicaNegocio.Entidades;
using Joki.LogicaNegocio.Enums;
using Joki.LogicaNegocio.Excepciones;
using Joki.LogicaNegocio.InterfacesRepositorio;
using Joki.LogicaNegocio.ValueObjects;
using Moq;
using System;
using System.Collections.Generic;
using Xunit;

namespace Joki.Pruebas.CasosDeUso.Grupo
{
    public class DesinscribirAlumnoTests
    {
        [Fact]
        public void Ejecutar_LanzaExcepcion_CuandoAlumnoNoEstaInscripto()
        {
            var mockRepoInscripcion = new Mock<IRepositorioInscripcion>();
            var mockRepoListaEspera = new Mock<IRepositorioListaEspera>();
            var mockRepoAlumno = new Mock<IRepositorioAlumno>();
            var mockRepoGrupo = new Mock<IRepositorioGrupo>();
            var mockServicioEmail = new Mock<IServicioEmail>();

            mockRepoInscripcion.Setup(r => r.Existe(1, 1)).Returns(false);

            var casoUso = new DesinscribirAlumno(
                mockRepoInscripcion.Object,
                mockRepoListaEspera.Object,
                mockRepoAlumno.Object,
                mockRepoGrupo.Object,
                mockServicioEmail.Object
            );

            var ex = Assert.Throws<LogicaNegocioException>(() => casoUso.Ejecutar(1, 1));
            Assert.Equal("El alumno no está inscripto en este grupo", ex.Message);
        }

        [Fact]
        public void Ejecutar_RemueveInscripcionYNoHaceNadaMas_CuandoListaEsperaEstaVacia()
        {
            var mockRepoInscripcion = new Mock<IRepositorioInscripcion>();
            var mockRepoListaEspera = new Mock<IRepositorioListaEspera>();
            var mockRepoAlumno = new Mock<IRepositorioAlumno>();
            var mockRepoGrupo = new Mock<IRepositorioGrupo>();
            var mockServicioEmail = new Mock<IServicioEmail>();

            mockRepoInscripcion.Setup(r => r.Existe(1, 1)).Returns(true);
            mockRepoListaEspera.Setup(r => r.ObtenerAlumnosEnEspera(1)).Returns(new List<int>());

            var casoUso = new DesinscribirAlumno(
                mockRepoInscripcion.Object,
                mockRepoListaEspera.Object,
                mockRepoAlumno.Object,
                mockRepoGrupo.Object,
                mockServicioEmail.Object
            );

            casoUso.Ejecutar(1, 1);

            mockRepoInscripcion.Verify(r => r.Remover(1, 1), Times.Once);
            mockRepoInscripcion.Verify(r => r.Agregar(It.IsAny<Inscripcion>()), Times.Never);
            mockServicioEmail.Verify(s => s.EnviarNotificacionInscripcion(It.IsAny<string>(), It.IsAny<string>()), Times.Never);
        }

        [Fact]
        public void Ejecutar_AvanzaListaEspera_CuandoListaTeniaAlumnos()
        {
            var mockRepoInscripcion = new Mock<IRepositorioInscripcion>();
            var mockRepoListaEspera = new Mock<IRepositorioListaEspera>();
            var mockRepoAlumno = new Mock<IRepositorioAlumno>();
            var mockRepoGrupo = new Mock<IRepositorioGrupo>();
            var mockServicioEmail = new Mock<IServicioEmail>();

            int alumnoSeleccionado = 1;
            int grupoId = 1;
            int alumnoEnEspera = 2;

            mockRepoInscripcion.Setup(r => r.Existe(alumnoSeleccionado, grupoId)).Returns(true);
            mockRepoListaEspera.Setup(r => r.ObtenerAlumnosEnEspera(grupoId)).Returns(new List<int> { alumnoEnEspera, 3 });

            var alumnoDb = new Alumno 
            { 
                UsuarioId = alumnoEnEspera, 
                Email = new Email("test@test.com") 
            };

            var grupoDb = new Joki.LogicaNegocio.Entidades.Grupo 
            { 
                Id = grupoId, 
                Nombre = "Grupo Avanzado" 
            };

            mockRepoAlumno.Setup(r => r.ObtenerPorId(alumnoEnEspera)).Returns(alumnoDb);
            mockRepoGrupo.Setup(r => r.ObtenerPorId(grupoId)).Returns(grupoDb);

            var casoUso = new DesinscribirAlumno(
                mockRepoInscripcion.Object,
                mockRepoListaEspera.Object,
                mockRepoAlumno.Object,
                mockRepoGrupo.Object,
                mockServicioEmail.Object
            );

            casoUso.Ejecutar(alumnoSeleccionado, grupoId);

            mockRepoInscripcion.Verify(r => r.Remover(alumnoSeleccionado, grupoId), Times.Once);
            mockRepoInscripcion.Verify(r => r.Agregar(It.Is<Inscripcion>(i => i.AlumnoId == alumnoEnEspera && i.GrupoId == grupoId)), Times.Once);
            mockRepoListaEspera.Verify(r => r.Remover(alumnoEnEspera, grupoId), Times.Once);
            mockServicioEmail.Verify(s => s.EnviarNotificacionInscripcion("test@test.com", "Grupo Avanzado"), Times.Once);
        }
    }
}