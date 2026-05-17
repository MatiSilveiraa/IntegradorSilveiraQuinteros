using Joki.LogicaNegocio.Entidades;
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
    }
}
