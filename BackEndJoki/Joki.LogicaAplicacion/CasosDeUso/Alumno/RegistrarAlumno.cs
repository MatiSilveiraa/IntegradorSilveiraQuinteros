using Joki.CasoUsoCompartida.DTOs.Alumno;
using Joki.CasoUsoCompartida.InterfacesCasosUso.Alumno;
using Joki.LogicaAplicacion.Mappers;
using Joki.LogicaNegocio.Excepciones.Usuario;
using Joki.LogicaNegocio.InterfacesRepositorio;
using Joki.LogicaNegocio.Entidades;

namespace Joki.LogicaAplicacion.CasosDeUso.Alumnos
{
    public class RegistrarAlumno : IRegistrarAlumno
    {
        private readonly IRepositorioUsuario _repositorioUsuario;
        private readonly IRepositorioAlumno _repositorioAlumno;

        public RegistrarAlumno(IRepositorioUsuario repositorioUsuario, IRepositorioAlumno repositorioAlumno)
        {
            _repositorioUsuario = repositorioUsuario;
            _repositorioAlumno = repositorioAlumno;
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
            Alumno alumno = mapperAlumno.ToEntity(request);

            int id = _repositorioAlumno.Agregar(alumno);
            alumno.UsuarioId = id;

            return mapperAlumno.ToResponse(alumno);
        }
    }
}
