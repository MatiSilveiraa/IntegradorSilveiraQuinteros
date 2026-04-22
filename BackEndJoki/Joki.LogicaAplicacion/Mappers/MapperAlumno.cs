using Joki.CasoUsoCompartida.DTOs.Alumno;
using Joki.LogicaNegocio.Entidades;
using Joki.LogicaNegocio.Enums;
using Joki.LogicaNegocio.ValueObjects;
using Microsoft.AspNetCore.Identity;

namespace Joki.LogicaAplicacion.Mappers
{
    public class MapperAlumno
    {
        public Alumno ToEntity(RegistrarAlumnoRequest request)
        {
            var hasheador = new PasswordHasher<object>();

            Contrasena contrasenaPlano = Contrasena.FromPlain(request.Contrasena);
            string hash = hasheador.HashPassword(null, contrasenaPlano.Valor);

            Alumno alumno = new Alumno
            {
                Nombre = new Nombre(request.Nombre),
                Apellido = new Apellido(request.Apellido),
                Email = new Email(request.Email),
                Contrasena = Contrasena.FromHash(hash),
                ProveedorAutenticacion = "LOCAL",
                Estado = EstadoUsuario.ACTIVO,
                Genero = (Genero)request.Genero,
                FechaNacimiento = request.FechaNacimiento,
                Celular = request.Celular,
                SociedadMedica = request.SociedadMedica,
                Peso = request.Peso,
                Estatura = request.Estatura
            };

            return alumno;
        }

        public RegistrarAlumnoResponse ToResponse(Alumno alumno)
        {
            return new RegistrarAlumnoResponse
            {
                UsuarioId = alumno.UsuarioId,
                Mensaje = "El registro fue realizado correctamente."
            };
        }
    }
}
