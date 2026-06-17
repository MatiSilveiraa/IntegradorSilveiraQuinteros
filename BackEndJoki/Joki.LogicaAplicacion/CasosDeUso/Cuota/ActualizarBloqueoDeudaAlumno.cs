using Joki.CasoUsoCompartida.InterfacesCasosUso.Cuota;
using Joki.LogicaNegocio.InterfacesRepositorio;

namespace Joki.LogicaAplicacion.CasosDeUso.Cuota
{
    public class ActualizarBloqueoDeudaAlumno :
        IActualizarBloqueoDeudaAlumno
    {
        private readonly IRepositorioAlumno _repositorioAlumno;
        private readonly IRepositorioCuota _repositorioCuota;

        public ActualizarBloqueoDeudaAlumno(
            IRepositorioAlumno repositorioAlumno,
            IRepositorioCuota repositorioCuota)
        {
            _repositorioAlumno = repositorioAlumno;
            _repositorioCuota = repositorioCuota;
        }

        public void Ejecutar(int alumnoId)
        {
            var alumno =
                _repositorioAlumno.ObtenerPorId(alumnoId);

            if (alumno == null)
            {
                return;
            }

            bool tieneDeudaVencida =
                _repositorioCuota.TieneCuotasVencidasPendientes(
                    alumnoId,
                    DateTime.Now,
                    7);

            alumno.BloqueadoPorDeuda =
                tieneDeudaVencida;

            _repositorioAlumno.Modificar(alumno);
        }
    }
}