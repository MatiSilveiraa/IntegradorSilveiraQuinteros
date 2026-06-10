using Joki.CasoUsoCompartida.DTOs.Desafio;
using Joki.CasoUsoCompartida.InterfacesCasosUso.Desafio;
using Joki.LogicaNegocio.Excepciones;
using Joki.LogicaNegocio.InterfacesRepositorio;

namespace Joki.LogicaAplicacion.CasosDeUso.Desafio
{
    public class ActualizarDesafio :
        IActualizarDesafio
    {
        private readonly IRepositorioDesafio _repositorioDesafio;

        public ActualizarDesafio(
            IRepositorioDesafio repositorioDesafio)
        {
            _repositorioDesafio = repositorioDesafio;
        }

        public void Ejecutar(
            int id,
            ActualizarDesafioRequest request)
        {
            var desafio =
                _repositorioDesafio.ObtenerPorId(id);

            if (desafio == null || !desafio.Activo)
            {
                throw new LogicaNegocioException(
                    "No existe el desafío");
            }

            if (string.IsNullOrWhiteSpace(request.Titulo))
            {
                throw new LogicaNegocioException(
                    "El título es obligatorio");
            }

            if (request.FechaFin < request.FechaInicio)
            {
                throw new LogicaNegocioException(
                    "La fecha fin debe ser mayor a la fecha inicio");
            }

            desafio.Titulo = request.Titulo;
            desafio.Descripcion = request.Descripcion;
            desafio.FechaInicio = request.FechaInicio;
            desafio.FechaFin = request.FechaFin;

            _repositorioDesafio.Modificar(desafio);
        }
    }
}