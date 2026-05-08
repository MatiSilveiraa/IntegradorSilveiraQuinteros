using Joki.CasoUsoCompartida.DTOs.Grupo;
using Joki.CasoUsoCompartida.InterfacesCasosUso.Grupo;
using Joki.LogicaAplicacion.Mappers;
using Joki.LogicaNegocio.Excepciones;
using Joki.LogicaNegocio.InterfacesRepositorio;

public class CrearGrupo : ICrearGrupo
{
    private readonly IRepositorioGrupo _repositorioGrupo;

    public CrearGrupo(IRepositorioGrupo repositorioGrupo)
    {
        _repositorioGrupo = repositorioGrupo;
    }

    public GrupoResponse Ejecutar(CrearGrupoRequest request)
    {
        if (request == null)
            throw new LogicaNegocioException("Datos inválidos.");

        if (string.IsNullOrWhiteSpace(request.Nombre))
            throw new LogicaNegocioException("El nombre es obligatorio.");

        if (request.Clases.Any(c => c.CupoMaximo <= 0))
        {
            throw new LogicaNegocioException(
                "Cupo inválido.");
        }

        if (request.Clases == null || !request.Clases.Any())
            throw new LogicaNegocioException("El grupo debe tener al menos una clase.");

        foreach (var clase in request.Clases)
        {
            if (clase.HoraFin <= clase.HoraInicio)
                throw new LogicaNegocioException("Horario inválido.");
        }

        var grupo = MapperGrupo.ToEntity(request);

        var grupoCreado = _repositorioGrupo.Agregar(grupo);

        return MapperGrupo.ToResponse(grupoCreado);
    }
}