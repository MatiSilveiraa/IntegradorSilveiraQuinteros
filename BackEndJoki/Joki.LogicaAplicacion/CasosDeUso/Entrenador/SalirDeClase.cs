using Joki.CasoUsoCompartida.InterfacesCasosUso.Entrenador;
using Joki.LogicaNegocio.Excepciones;
using Joki.LogicaNegocio.InterfacesRepositorio;

namespace Joki.LogicaAplicacion.CasosDeUso.Entrenador
{
    public class SalirDeClase : ISalirDeClase
    {
        private readonly IRepositorioClaseEntrenador
            _repositorioClaseEntrenador;

        public SalirDeClase(
            IRepositorioClaseEntrenador repositorioClaseEntrenador)
        {
            _repositorioClaseEntrenador =
                repositorioClaseEntrenador;
        }

        public void Ejecutar(
            int claseId,
            int entrenadorId)
        {
            var relacion =
                _repositorioClaseEntrenador.Obtener(
                    claseId,
                    entrenadorId);

            if (relacion == null)
            {
                throw new LogicaNegocioException(
                    "No estás asociado a esta clase");
            }

            bool eraPrincipal =
                relacion.EsPrincipal;

            _repositorioClaseEntrenador.Eliminar(
                relacion);

            if (!eraPrincipal)
            {
                return;
            }

            var restantes =
                _repositorioClaseEntrenador
                    .ObtenerPorClase(
                        claseId);

            var nuevoPrincipal =
                restantes.FirstOrDefault();

            if (nuevoPrincipal != null)
            {
                nuevoPrincipal.EsPrincipal =
                    true;

                _repositorioClaseEntrenador.Modificar(
                    nuevoPrincipal);
            }
        }
    }
}