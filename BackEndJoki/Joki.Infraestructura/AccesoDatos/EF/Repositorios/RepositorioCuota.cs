using Joki.LogicaNegocio.Entidades;
using Joki.LogicaNegocio.Enums;
using Joki.LogicaNegocio.InterfacesRepositorio;

namespace Joki.Infraestructura.AccesoDatos.EF.Repositorios
{
    public class RepositorioCuota : IRepositorioCuota
    {
        private readonly JokiContext _contexto;

        public RepositorioCuota(JokiContext contexto)
        {
            _contexto = contexto;
        }

        public Cuota? ObtenerPorId(int id)
        {
            return _contexto.Cuotas
                .FirstOrDefault(c => c.Id == id);
        }

        public Cuota? ObtenerPorAlumnoMesYAnio(
            int alumnoId,
            int mes,
            int anio)
        {
            return _contexto.Cuotas
                .FirstOrDefault(c =>
                    c.AlumnoId == alumnoId &&
                    c.Mes == mes &&
                    c.Anio == anio);
        }

        public void Agregar(Cuota cuota)
        {
            _contexto.Cuotas.Add(cuota);

            _contexto.SaveChanges();
        }

        public void Modificar(Cuota cuota)
        {
            _contexto.Cuotas.Update(cuota);

            _contexto.SaveChanges();
        }

        public IEnumerable<Cuota> ObtenerPorAlumno(int alumnoId)
        {
            return _contexto.Cuotas
                .Where(c => c.AlumnoId == alumnoId)
                .OrderByDescending(c => c.Anio)
                .ThenByDescending(c => c.Mes)
                .ToList();
        }

        public IEnumerable<Cuota> ObtenerPendientes()
        {
            return _contexto.Cuotas
                .Where(c => c.Estado == EstadoCuota.PENDIENTE)
                .ToList();
        }
    }
}
