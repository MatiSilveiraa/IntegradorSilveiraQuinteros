using Joki.CasoUsoCompartida.DTOs.Alumno;
using Joki.CasoUsoCompartida.InterfacesCasosUso.Alumno;
using Joki.CasoUsoCompartida.InterfacesCasosUso.Cuota;
using Joki.LogicaAplicacion.Mappers;
using Joki.LogicaNegocio.Excepciones.Usuario;
using Joki.LogicaNegocio.InterfacesRepositorio;
using alumnoEntidad = Joki.LogicaNegocio.Entidades.Alumno;

namespace Joki.LogicaAplicacion.CasosDeUso.Alumnos
{
    public class RegistrarAlumno : IRegistrarAlumno
    {
        private readonly IRepositorioUsuario _repositorioUsuario;
        private readonly IRepositorioAlumno _repositorioAlumno;
        private readonly IGenerarCuotaInicialAlumno _generarCuotaInicialAlumno;

        public RegistrarAlumno(IRepositorioUsuario repositorioUsuario, IRepositorioAlumno repositorioAlumno, IGenerarCuotaInicialAlumno generarCuotaInicialAlumno)
        {
            _repositorioUsuario = repositorioUsuario;
            _repositorioAlumno = repositorioAlumno;
            _generarCuotaInicialAlumno = generarCuotaInicialAlumno;
        }

        public RegistrarAlumnoResponse Ejecutar(RegistrarAlumnoRequest request)
        {
            if (request == null)
                throw new UsuarioException("Debe enviar los datos de registro.");

            if (string.IsNullOrWhiteSpace(request.Nombre) ||
                string.IsNullOrWhiteSpace(request.Apellido) ||
                string.IsNullOrWhiteSpace(request.Email) ||
                string.IsNullOrWhiteSpace(request.Contrasena))
            {
                throw new UsuarioException("Nombre, apellido, email y contraseña son obligatorios.");
            }

            if (request.Peso <= 0 || request.Estatura <= 0)
            {
                throw new UsuarioException("Peso y estatura son obligatorios.");
            }

            if (_repositorioUsuario.ExisteEmail(request.Email))
            {
                throw new UsuarioRepetidoException("El correo electrónico ya está registrado.");
            }

            MapperAlumno mapperAlumno = new MapperAlumno();
            alumnoEntidad alumno = mapperAlumno.ToEntity(request);

            int id = _repositorioAlumno.Agregar(alumno);
            alumno.UsuarioId = id;
            _generarCuotaInicialAlumno.Ejecutar(id);

            return mapperAlumno.ToResponse(alumno);
        }
    }
}
