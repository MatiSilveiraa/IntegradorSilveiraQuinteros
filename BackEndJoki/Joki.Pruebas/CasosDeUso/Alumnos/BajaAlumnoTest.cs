using Joki.LogicaAplicacion.CasosDeUso.Alumno;
using Joki.LogicaNegocio.Entidades;
using Joki.LogicaNegocio.Enums;
using Joki.LogicaNegocio.InterfacesRepositorio;
using Moq;
using Xunit;

namespace Joki.Pruebas.CasosDeUso.Alumnos
{
    public class BajaAlumnoTest
    {
        [Fact]
        public void BajaAlumno_DeberiaCambiarEstadoAInactivo()
        {
            var mockRepo = new Mock<IRepositorioAlumno>();

            var alumno = new Alumno
            {
                UsuarioId = 1,
                Estado = EstadoUsuario.ACTIVO
            };

            mockRepo.Setup(r => r.ObtenerPorId(1)).Returns(alumno);

            var casoUso = new BajaAlumno(mockRepo.Object);
            casoUso.Ejecutar(1);
            Assert.Equal(EstadoUsuario.INACTIVO, alumno.Estado);
        }
    }
}