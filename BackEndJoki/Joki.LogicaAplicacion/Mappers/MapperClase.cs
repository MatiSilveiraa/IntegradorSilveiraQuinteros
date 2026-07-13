using Joki.CasoUsoCompartida.DTOs.Clase;
using Joki.LogicaNegocio.Entidades;
using Joki.LogicaNegocio.Enums;
using Joki.LogicaNegocio.ValueObjects;

namespace Joki.LogicaAplicacion.Mappers
{
    public static class MapperClase
    {
        public static Clase ToEntity(
            CrearClaseRequest request)
        {
            return new Clase
            {
                GrupoId =
                    request.GrupoId,

                DiaSemana =
                    request.DiaSemana,

                HoraInicio =
                    request.HoraInicio,

                HoraFin =
                    request.HoraFin,

                Ubicacion = new Ubicacion
                {
                    Latitud =
                        request.Latitud,

                    Longitud =
                        request.Longitud,

                    CodigoPostal =
                        request.CodigoPostal
                            ?? string.Empty
                },

                RadioGeolocalizacion =
                    request.RadioGeolocalizacion,

                EsFija =
                    request.EsFija,

                FechaInicio =
                    request.FechaInicio,

                FechaFin =
                    request.FechaFin,

                CupoMaximo =
                    request.CupoMaximo,

                Estado =
                    EstadoClase.Programada
            };
        }

        public static ClaseResponse ToResponse(
            Clase clase)
        {
            if (clase == null)
            {
                throw new ArgumentNullException(
                    nameof(clase));
            }

            var relacionesEntrenadores =
                clase.Entrenadores?
                    .Where(x =>
                        x.Entrenador != null)
                    .OrderByDescending(x =>
                        x.EsPrincipal)
                    .ThenBy(x =>
                        x.Entrenador.Nombre?.Valor
                        ?? string.Empty)
                    .ThenBy(x =>
                        x.Entrenador.Apellido?.Valor
                        ?? string.Empty)
                    .ToList()
                ?? new List<ClaseEntrenador>();

            var relacionPrincipal =
                relacionesEntrenadores
                    .FirstOrDefault(x =>
                        x.EsPrincipal)
                ?? relacionesEntrenadores
                    .FirstOrDefault();

            string? nombrePrincipal =
                relacionPrincipal == null
                    ? null
                    : ObtenerNombreCompleto(
                        relacionPrincipal.Entrenador);

            return new ClaseResponse
            {
                Id =
                    clase.Id,

                GrupoId =
                    clase.GrupoId,

                GrupoNombre =
                    clase.Grupo?.Nombre,

                UbicacionNombre =
                    ObtenerNombreUbicacion(
                        clase),

    
                EntrenadorNombre =
                    nombrePrincipal,

                EntrenadoresIds =
                    relacionesEntrenadores
                        .Select(x =>
                            x.EntrenadorId)
                        .ToList(),

                Entrenadores =
                    relacionesEntrenadores
                        .Select(x =>
                            ObtenerNombreCompleto(
                                x.Entrenador))
                        .Where(nombre =>
                            !string.IsNullOrWhiteSpace(
                                nombre))
                        .ToList(),

                EntrenadorPrincipalId =
                    relacionPrincipal
                        ?.EntrenadorId,

                EntrenadorPrincipal =
                    nombrePrincipal,

                DiaSemana =
                    clase.DiaSemana.ToString(),

                HoraInicio =
                    clase.HoraInicio,

                HoraFin =
                    clase.HoraFin,

                Latitud =
                    clase.Ubicacion?.Latitud
                    ?? 0,

                Longitud =
                    clase.Ubicacion?.Longitud
                    ?? 0,

                CodigoPostal =
                    clase.Ubicacion?.CodigoPostal
                    ?? string.Empty,

                RadioGeolocalizacion =
                    clase.RadioGeolocalizacion,

                EsFija =
                    clase.EsFija,

                FechaInicio =
                    clase.FechaInicio,

                FechaFin =
                    clase.FechaFin,

                CupoMaximo =
                    clase.CupoMaximo,

                Estado =
                    clase.Estado.ToString(),

                CantidadInscriptos =
                    clase.Inscripciones?.Count
                    ?? 0
            };
        }

        public static void UpdateEntity(
            Clase clase,
            EditarClaseRequest request)
        {
            if (clase == null)
            {
                throw new ArgumentNullException(
                    nameof(clase));
            }

            if (request == null)
            {
                throw new ArgumentNullException(
                    nameof(request));
            }

            clase.GrupoId =
                request.GrupoId;

            clase.DiaSemana =
                request.DiaSemana;

            clase.HoraInicio =
                request.HoraInicio;

            clase.HoraFin =
                request.HoraFin;

            clase.Ubicacion = new Ubicacion
            {
                Latitud =
                    request.Latitud,

                Longitud =
                    request.Longitud,

                CodigoPostal =
                    request.CodigoPostal
                        ?? string.Empty
            };

            clase.RadioGeolocalizacion =
                request.RadioGeolocalizacion;

            clase.EsFija =
                request.EsFija;

            clase.FechaInicio =
                request.FechaInicio;

            clase.FechaFin =
                request.FechaFin;

            clase.CupoMaximo =
                request.CupoMaximo;
        }

        private static string ObtenerNombreUbicacion(
            Clase clase)
        {
            if (clase.Ubicacion == null)
            {
                return string.Empty;
            }

            if (!string.IsNullOrWhiteSpace(
                clase.Ubicacion.Direccion))
            {
                return clase.Ubicacion.Direccion;
            }

            return clase.Ubicacion.CodigoPostal
                ?? string.Empty;
        }

        private static string ObtenerNombreCompleto(
            Entrenador entrenador)
        {
            if (entrenador == null)
            {
                return string.Empty;
            }

            string nombre =
                entrenador.Nombre?.Valor
                ?? string.Empty;

            string apellido =
                entrenador.Apellido?.Valor
                ?? string.Empty;

            return $"{nombre} {apellido}".Trim();
        }
    }
}