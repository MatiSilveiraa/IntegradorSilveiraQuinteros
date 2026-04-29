using Joki.CasoUsoCompartida.DTOs.Grupo;
using Joki.LogicaNegocio.Entidades;
using Joki.LogicaNegocio.Enums;
using Joki.LogicaNegocio.ValueObjects;

namespace Joki.LogicaAplicacion.Mappers
{
    public class MapperGrupo
    {
        public static GrupoResponse ToResponse(Grupo grupo)
        {
            return new GrupoResponse
            {
                Id = grupo.Id,
                Nombre = grupo.Nombre,
                Nivel = grupo.Nivel,
                CupoMaximo = grupo.CupoMaximo,
                DiaSemana = grupo.DiaSemana.ToString(),
                HoraInicio = grupo.HoraInicio,
                HoraFin = grupo.HoraFin,
                Latitud = grupo.Ubicacion.Latitud,
                Longitud = grupo.Ubicacion.Longitud,
                CodigoPostal = grupo.Ubicacion.CodigoPostal,
                RadioGeolocalizacion = grupo.RadioGeolocalizacion,
                EsFijo = grupo.EsFijo,
                FechaInicio = grupo.FechaInicio,
                FechaFin = grupo.FechaFin,
                Estado = grupo.Estado.ToString(),
                EntrenadorId = grupo.EntrenadorId
            };
        }

        public static Grupo ToEntity(CrearGrupoRequest request)
        {
            return new Grupo
            {
                Nombre = request.Nombre,
                Nivel = request.Nivel,
                CupoMaximo = request.CupoMaximo,
                DiaSemana = Enum.Parse<DiaSemana>(request.DiaSemana, true),
                HoraInicio = request.HoraInicio,
                HoraFin = request.HoraFin,
                Ubicacion = new Ubicacion
                {
                    Latitud = request.Latitud,
                    Longitud = request.Longitud,
                    CodigoPostal = request.CodigoPostal
                },
                RadioGeolocalizacion = request.RadioGeolocalizacion,
                EsFijo = request.EsFijo,
                FechaInicio = request.FechaInicio,
                FechaFin = request.FechaFin,
                Estado = EstadoGrupo.ACTIVO,
                EntrenadorId = request.EntrenadorId
            };
        }

        public static void UpdateEntity(Grupo grupo, EditarGrupoRequest request)
        {
            grupo.Nombre = request.Nombre;
            grupo.Nivel = request.Nivel;
            grupo.CupoMaximo = request.CupoMaximo;
            grupo.DiaSemana = Enum.Parse<DiaSemana>(request.DiaSemana, true);
            grupo.HoraInicio = request.HoraInicio;
            grupo.HoraFin = request.HoraFin;
            grupo.Ubicacion = new Ubicacion
            {
                Latitud = request.Latitud,
                Longitud = request.Longitud,
                CodigoPostal = request.CodigoPostal
            };
            grupo.RadioGeolocalizacion = request.RadioGeolocalizacion;
            grupo.EsFijo = request.EsFijo;
            grupo.FechaInicio = request.FechaInicio;
            grupo.FechaFin = request.FechaFin;
            grupo.EntrenadorId = request.EntrenadorId;
        }
    }
}
