using Joki.CasoUsoCompartida.DTOs.Clase;
using Joki.CasoUsoCompartida.DTOs.Grupo;

using Joki.LogicaNegocio.Entidades;
using Joki.LogicaNegocio.Enums;

namespace Joki.LogicaAplicacion.Mappers
{
    public class MapperGrupo
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
                ? grupo.Clases.Select(MapperClase.ToResponse).ToList()
                : new List<ClaseResponse>()
            };
        }

        public static Grupo ToEntity(CrearGrupoRequest request)
        {
            return new Grupo
            {
                Nombre = request.Nombre,

                Nivel = request.Nivel,

                Estado = EstadoGrupo.ACTIVO,

                EntrenadorId = request.EntrenadorId,

                Clases = request.Clases != null
                    ? request.Clases.Select(MapperClase.ToEntity).ToList()
                    : new List<Clase>()
            };
        }

        public static void UpdateEntity(
            Grupo grupo,
            EditarGrupoRequest request)
        {
            grupo.Nombre = request.Nombre;

            grupo.Nivel = request.Nivel;

            grupo.EntrenadorId =
                request.EntrenadorId;
        }
    }
}