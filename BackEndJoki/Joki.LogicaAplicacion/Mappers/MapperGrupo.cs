using Joki.CasoUsoCompartida.DTOs.Clase;
using Joki.CasoUsoCompartida.DTOs.Grupo;
using Joki.LogicaNegocio.Entidades;
using Joki.LogicaNegocio.Enums;

namespace Joki.LogicaAplicacion.Mappers
{
    public static class MapperGrupo
    {
        public static GrupoResponse ToResponse(
            Grupo grupo)
        {
            return new GrupoResponse
            {
                Id = grupo.Id,

                Nombre = grupo.Nombre,

                Nivel = grupo.Nivel,

                Estado = grupo.Estado.ToString(),

                EntrenadorId = grupo.EntrenadorId,

                Clases = grupo.Clases != null
                    ? grupo.Clases
                        .Select(MapperClase.ToResponse)
                        .ToList()
                    : new List<ClaseResponse>()
            };
        }

        public static Grupo ToEntity(
            CrearGrupoRequest request,
            int entrenadorResponsableId)
        {
            return new Grupo
            {
                Nombre = request.Nombre.Trim(),

                Nivel = request.Nivel.Trim(),

                Estado = EstadoGrupo.ACTIVO,

                EntrenadorId = entrenadorResponsableId,

                Clases = new List<Clase>()
            };
        }

        public static void UpdateEntity(
            Grupo grupo,
            EditarGrupoRequest request)
        {
            grupo.Nombre = request.Nombre.Trim();

            grupo.Nivel = request.Nivel.Trim();
        }
    }
}