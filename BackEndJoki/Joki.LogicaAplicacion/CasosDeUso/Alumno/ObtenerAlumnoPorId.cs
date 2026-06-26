using Joki.CasoUsoCompartida.DTOs.Alumno;
using Joki.CasoUsoCompartida.InterfacesCasosUso.Alumno;
using Joki.LogicaNegocio.InterfacesRepositorio;

namespace Joki.LogicaAplicacion.CasosDeUso.Alumno
{
    public class ObtenerAlumnoPorId : IObtenerAlumnoPorId
    {
        private readonly IRepositorioAlumno _repo;

        public ObtenerAlumnoPorId(IRepositorioAlumno repo)
        {
            _repo = repo;
        }

        public AlumnoDetalleResponse Ejecutar(int id)
        {
            var alumno = _repo.ObtenerPorId(id);

            if (alumno == null)
            {
                throw new Exception("Alumno no encontrado");
            }

            return new AlumnoDetalleResponse
            {
                Id = alumno.UsuarioId,

                Nombre = alumno.Nombre.Valor,
                Apellido = alumno.Apellido.Valor,
                Email = alumno.Email.Valor,
                Celular = alumno.Celular != null ? alumno.Celular.Valor : null,

                SociedadMedica = alumno.SociedadMedica,
                FechaNacimiento = alumno.FechaNacimiento,
                Genero = (int)alumno.Genero,

                Peso = alumno.Peso,
                Estatura = alumno.Estatura,
                IMC = alumno.IMC,

                BloqueadoPorInasistencias = alumno.BloqueadoPorInasistencias,
                BloqueadoPorDeuda = alumno.BloqueadoPorDeuda,

                RachaAsistenciaMensual = alumno.RachaAsistenciaMensual,

                TwoFactorEnabled = alumno.TwoFactorEnabled,

                Estado = alumno.Estado.ToString(),

                CantidadClasesInscripto = alumno.Inscripciones.Count,

                CuotasPendientes = alumno.Cuotas
        .Count(c => c.Estado.ToString() == "PENDIENTE")
            };
        }
    }
}