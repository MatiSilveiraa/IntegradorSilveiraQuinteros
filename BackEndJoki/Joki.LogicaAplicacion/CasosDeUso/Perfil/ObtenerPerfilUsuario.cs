using Joki.CasoUsoCompartida.DTOs.Perfil;
using Joki.CasoUsoCompartida.InterfacesCasosUso.Perfil;
using Joki.LogicaNegocio.InterfacesRepositorio;
using Entidades = Joki.LogicaNegocio.Entidades;

namespace Joki.LogicaAplicacion.CasosDeUso.Perfil
{
    public class ObtenerPerfilUsuario : IObtenerPerfilUsuario
    {
        private readonly IRepositorioUsuario _repositorioUsuario;
        private readonly IRepositorioAlumno _repositorioAlumno;

        public ObtenerPerfilUsuario(
            IRepositorioUsuario repositorioUsuario,
            IRepositorioAlumno repositorioAlumno)
        {
            _repositorioUsuario = repositorioUsuario;
            _repositorioAlumno = repositorioAlumno;
        }

        public PerfilResponse Ejecutar(int usuarioId)
        {
            var usuario = _repositorioUsuario.ObtenerPorId(usuarioId);

            if (usuario == null)
            {
                throw new InvalidOperationException(
                    "El usuario solicitado no existe.");
            }

            bool bloqueadoPorInasistencias = false;
            int rachaAsistenciaMensual = 0;
            bool descuentoRachaGenerado = false;
            bool bloqueadoPorDeuda = false;

            var alumno = _repositorioAlumno.ObtenerPorId(usuarioId);

            if (alumno != null)
            {
                bloqueadoPorInasistencias =
                    alumno.BloqueadoPorInasistencias;

                rachaAsistenciaMensual =
                    alumno.RachaAsistenciaMensual;

                descuentoRachaGenerado =
                    alumno.DescuentoRachaGenerado;
                bloqueadoPorDeuda = alumno.BloqueadoPorDeuda;
            }

            return new PerfilResponse
            {
                Id = usuario.UsuarioId,
                Nombre = usuario.Nombre?.Valor ?? "",
                Apellido = usuario.Apellido?.Valor ?? "",
                Email = usuario.Email?.Valor ?? "",
                Celular = usuario.Celular?.Valor ?? "",
                SociedadMedica = usuario.SociedadMedica,
                FechaNacimiento = usuario.FechaNacimiento,
                Genero = (int)usuario.Genero,

                Peso = alumno?.Peso,
                Estatura = alumno?.Estatura,
                IMC = alumno?.IMC,

                BloqueadoPorInasistencias =
          bloqueadoPorInasistencias,
                BloqueadoPorDeuda = bloqueadoPorDeuda,

                RachaAsistenciaMensual =
          rachaAsistenciaMensual,

                DescuentoRachaGenerado =
          descuentoRachaGenerado,

                TwoFactorEnabled =
          usuario.TwoFactorEnabled
            };
        }
    }
}
