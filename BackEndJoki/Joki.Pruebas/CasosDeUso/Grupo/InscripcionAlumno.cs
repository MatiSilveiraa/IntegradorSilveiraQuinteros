using Xunit;
using Moq;
using Joki.LogicaAplicacion.CasosDeUso.Grupo;
using Joki.LogicaNegocio.Entidades;
using Joki.LogicaNegocio.Enums;
using Joki.LogicaNegocio.InterfacesRepositorio;
using GrupoEntidad = Joki.LogicaNegocio.Entidades.Grupo;

namespace Joki.Pruebas.CasosDeUso.Grupo
{
    public class InscribirAlumnoTests
    {
        private readonly Mock<IRepositorioGrupo> _repoGrupo = new();
        private readonly Mock<IRepositorioAlumno> _repoAlumno = new();
        private readonly Mock<IRepositorioInscripcion> _repoInscripcion = new();
        private readonly Mock<IRepositorioListaEspera> _repoLista = new();
        private InscribirAlumno CrearCU()
        {
            return new InscribirAlumno(
                _repoGrupo.Object,
                _repoAlumno.Object,
                _repoInscripcion.Object,
                _repoLista.Object
            );
        }


        [Fact]
        public void AlumnoNoExiste_LanzaException()
        {
            _repoAlumno.Setup(r => r.ObtenerPorId(1)).Returns((Alumno)null);

            var cu = CrearCU();

            var ex = Assert.Throws<Exception>(() => cu.Ejecutar(1, 1));

            Assert.Equal("Alumno no existe", ex.Message);
        }

        [Fact]
        public void AlumnoInactivo_LanzaException()
        {
            var alumno = new Alumno { UsuarioId = 1, Estado = EstadoUsuario.INACTIVO };

            _repoAlumno.Setup(r => r.ObtenerPorId(1)).Returns(alumno);

            var cu = CrearCU();

            var ex = Assert.Throws<Exception>(() => cu.Ejecutar(1, 1));

            Assert.Equal("Alumno inactivo", ex.Message);
        }

        [Fact]
        public void GrupoNoExiste_LanzaException()
        {
            var alumno = new Alumno { UsuarioId = 1, Estado = EstadoUsuario.ACTIVO };

            _repoAlumno.Setup(r => r.ObtenerPorId(1)).Returns(alumno);
            _repoGrupo.Setup(r => r.ObtenerPorId(1)).Returns((GrupoEntidad)null);

            var cu = CrearCU();

            var ex = Assert.Throws<Exception>(() => cu.Ejecutar(1, 1));

            Assert.Equal("Grupo no existe", ex.Message);
        }

        [Fact]
        public void AlumnoYaInscripto_LanzaException()
        {
            var alumno = new Alumno { UsuarioId = 1, Estado = EstadoUsuario.ACTIVO };
            var grupo = new GrupoEntidad { Id = 1 };

            _repoAlumno.Setup(r => r.ObtenerPorId(1)).Returns(alumno);
            _repoGrupo.Setup(r => r.ObtenerPorId(1)).Returns(grupo);
            _repoInscripcion.Setup(r => r.Existe(1, 1)).Returns(true);

            var cu = CrearCU();

            var ex = Assert.Throws<Exception>(() => cu.Ejecutar(1, 1));

            Assert.Equal("El alumno ya está inscripto", ex.Message);
        }

        [Fact]
        public void SuperposicionHoraria_LanzaException()
        {
            var alumno = new Alumno { UsuarioId = 1, Estado = EstadoUsuario.ACTIVO };
            var grupo = new GrupoEntidad { Id = 1 };

            _repoAlumno.Setup(r => r.ObtenerPorId(1)).Returns(alumno);
            _repoGrupo.Setup(r => r.ObtenerPorId(1)).Returns(grupo);
            _repoInscripcion.Setup(r => r.Existe(1, 1)).Returns(false);
            _repoInscripcion.Setup(r => r.TieneSuperposicion(1, grupo)).Returns(true);

            var cu = CrearCU();

            var ex = Assert.Throws<Exception>(() => cu.Ejecutar(1, 1));

            Assert.Equal("Superposición horaria", ex.Message);
        }


        [Fact]
        public void YaEnListaEspera_LanzaException()
        {
            var alumno = new Alumno { UsuarioId = 1, Estado = EstadoUsuario.ACTIVO };
            var grupo = new GrupoEntidad { Id = 1 };

            _repoAlumno.Setup(r => r.ObtenerPorId(1)).Returns(alumno);
            _repoGrupo.Setup(r => r.ObtenerPorId(1)).Returns(grupo);
            _repoInscripcion.Setup(r => r.Existe(1, 1)).Returns(false);
            _repoInscripcion.Setup(r => r.TieneSuperposicion(1, grupo)).Returns(false);
            _repoLista.Setup(r => r.Existe(1, 1)).Returns(true);

            var cu = CrearCU();

            var ex = Assert.Throws<Exception>(() => cu.Ejecutar(1, 1));

            Assert.Equal("Ya está en lista de espera", ex.Message);
        }

        [Fact]
        public void GrupoLleno_AgregaAListaEspera()
        {
            var alumno = new Alumno { UsuarioId = 1, Estado = EstadoUsuario.ACTIVO };
            var grupo = new GrupoEntidad { Id = 1, CupoMaximo = 1 };

            _repoAlumno.Setup(r => r.ObtenerPorId(1)).Returns(alumno);
            _repoGrupo.Setup(r => r.ObtenerPorId(1)).Returns(grupo);
            _repoInscripcion.Setup(r => r.Existe(1, 1)).Returns(false);
            _repoInscripcion.Setup(r => r.TieneSuperposicion(1, grupo)).Returns(false);
            _repoLista.Setup(r => r.Existe(1, 1)).Returns(false);
            _repoInscripcion.Setup(r => r.CantidadPorGrupo(1)).Returns(1);

            var cu = CrearCU();

            cu.Ejecutar(1, 1);

            _repoLista.Verify(r => r.Agregar(1, 1), Times.Once);
            _repoInscripcion.Verify(r => r.Agregar(It.IsAny<Inscripcion>()), Times.Never);
        }

        [Fact]
        public void InscripcionCorrecta_GuardaInscripcion()
        {
            var alumno = new Alumno { UsuarioId = 1, Estado = EstadoUsuario.ACTIVO };
            var grupo = new GrupoEntidad { Id = 1, CupoMaximo = 5 };

            _repoAlumno.Setup(r => r.ObtenerPorId(1)).Returns(alumno);
            _repoGrupo.Setup(r => r.ObtenerPorId(1)).Returns(grupo);
            _repoInscripcion.Setup(r => r.Existe(1, 1)).Returns(false);
            _repoInscripcion.Setup(r => r.TieneSuperposicion(1, grupo)).Returns(false);
            _repoLista.Setup(r => r.Existe(1, 1)).Returns(false);
            _repoInscripcion.Setup(r => r.CantidadPorGrupo(1)).Returns(1);

            var cu = CrearCU();

            cu.Ejecutar(1, 1);

            _repoInscripcion.Verify(r => r.Agregar(It.IsAny<Inscripcion>()), Times.Once);
        }
    }
}