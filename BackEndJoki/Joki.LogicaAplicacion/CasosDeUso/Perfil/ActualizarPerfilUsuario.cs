using Joki.CasoUsoCompartida.DTOs.Perfil;
using Joki.CasoUsoCompartida.InterfacesCasosUso.Perfil;
using AlumnoEntidad = Joki.LogicaNegocio.Entidades.Alumno;
using Joki.LogicaNegocio.Enums;
using Joki.LogicaNegocio.InterfacesRepositorio;
using Joki.LogicaNegocio.ValueObjects;

namespace Joki.LogicaAplicacion.CasosDeUso.Perfil
{
    public class ActualizarPerfilUsuario : IActualizarPerfilUsuario
    {
        private readonly IRepositorioUsuario _repositorio;

        public ActualizarPerfilUsuario(
            IRepositorioUsuario repositorio)
        {
            _repositorio = repositorio;
        }

        public PerfilResponse Ejecutar(
            int usuarioId,
            ActualizarPerfilRequest request)
        {
            if (request == null)
            {
                throw new ArgumentException(
                    "Los datos de actualización no pueden ser nulos.");
            }

            var usuario =
                _repositorio.ObtenerPorId(usuarioId);

            if (usuario == null)
            {
                throw new InvalidOperationException(
                    "El usuario solicitado no existe.");
            }

            usuario.Nombre =
                new Nombre(request.Nombre);

            usuario.Apellido =
                new Apellido(request.Apellido);

            usuario.Celular =
                Celular.Crear(request.Celular);

            usuario.SociedadMedica =
                request.SociedadMedica;

            usuario.FechaNacimiento =
                request.FechaNacimiento;

            if (Enum.IsDefined(typeof(Genero), request.Genero))
            {
                usuario.Genero =
                    (Genero)request.Genero;
            }

            if (usuario is AlumnoEntidad alumno)
            {
                if (request.Peso.HasValue &&
                    (request.Peso <= 0 || request.Peso > 500))
                {
                    throw new ArgumentException(
                        "El peso debe ser mayor a 0 y menor o igual a 500 kg.");
                }

                if (request.Estatura.HasValue &&
                    (request.Estatura <= 0 || request.Estatura > 3))
                {
                    throw new ArgumentException(
                        "La estatura debe ser mayor a 0 y menor o igual a 3 metros.");
                }

                alumno.Peso =
                    request.Peso;

                alumno.Estatura =
                    request.Estatura;

                alumno.IMC =
                    CalcularIMC(
                        request.Peso,
                        request.Estatura);
            }

            _repositorio.Modificar(usuario);

            return CrearPerfilResponse(usuario);
        }

        private static PerfilResponse CrearPerfilResponse(
            Usuario usuario)
        {
            PerfilResponse response =
                new PerfilResponse
                {
                    Id = usuario.UsuarioId,
                    Nombre = usuario.Nombre.Valor,
                    Apellido = usuario.Apellido.Valor,
                    Email = usuario.Email.Valor,
                    Celular = usuario.Celular.Valor,
                    SociedadMedica = usuario.SociedadMedica,
                    FechaNacimiento = usuario.FechaNacimiento,
                    Genero = (int)usuario.Genero,
                    TwoFactorEnabled = usuario.TwoFactorEnabled
                };

            if (usuario is AlumnoEntidad alumno)
            {
                response.Peso =
                    alumno.Peso;

                response.Estatura =
                    alumno.Estatura;

                response.IMC =
                    alumno.IMC;

                response.BloqueadoPorInasistencias =
                    alumno.BloqueadoPorInasistencias;

                response.RachaAsistenciaMensual =
                    alumno.RachaAsistenciaMensual;

                response.DescuentoRachaGenerado =
                    alumno.DescuentoRachaGenerado;
            }

            return response;
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