using Joki.CasoUsoCompartida.DTOs.Desafio;
using Joki.CasoUsoCompartida.InterfacesCasosUso.Desafio;
using Joki.LogicaNegocio.Excepciones;
using Joki.LogicaNegocio.InterfacesRepositorio;

namespace Joki.LogicaAplicacion.CasosDeUso.Desafio
{
    public class CrearDesafio : ICrearDesafio
    {
        private readonly IRepositorioDesafio _repositorioDesafio;

        public CrearDesafio(
            IRepositorioDesafio repositorioDesafio)
        {
            _repositorioDesafio = repositorioDesafio;
        }

        public void Ejecutar(
            CrearDesafioRequest request)
        {
            if (string.IsNullOrWhiteSpace(
                request.Titulo))
            {
                throw new LogicaNegocioException(
                    "El título es obligatorio");
            }

            if (request.FechaFin <
                request.FechaInicio)
            {
                throw new LogicaNegocioException(
                    "La fecha fin debe ser mayor a la fecha inicio");
            }

            var desafio = new LogicaNegocio.Entidades.Desafio
            {
                Titulo = request.Titulo,
                Descripcion = request.Descripcion,
                FechaInicio = request.FechaInicio,
                FechaFin = request.FechaFin
            };

            _repositorioDesafio.Agregar(
                desafio);
        }
    }
}