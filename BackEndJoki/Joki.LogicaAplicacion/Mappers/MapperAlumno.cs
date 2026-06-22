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
                RolId = 3,
                Genero = (Genero)request.Genero,
                FechaNacimiento = request.FechaNacimiento,
                Celular = Celular.Crear(request.Celular),
                SociedadMedica = request.SociedadMedica,
                Peso = request.Peso,
                Estatura = request.Estatura,
                IMC = CalcularIMC(request.Peso, request.Estatura)
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

        public static DtoAlumno ToDto(Alumno alumno)
        {
            return new DtoAlumno(
                alumno.UsuarioId,
                alumno.Nombre.Valor,
                alumno.Apellido.Valor,
                alumno.Email.Valor,
                alumno.Estado.ToString()
            );
        }

        public static IEnumerable<DtoAlumno> ToDtoList(IEnumerable<Alumno> alumnos)
        {
            return alumnos.Select(ToDto);
        }

        private static decimal? CalcularIMC(
            decimal? peso,
            decimal? estatura)
        {
            if (!peso.HasValue ||
                !estatura.HasValue ||
                peso <= 0 ||
                estatura <= 0)
            {
                return null;
            }

            return Math.Round(
                peso.Value / (estatura.Value * estatura.Value),
                2);
        }
    }
}