using Joki.CasoUsoCompartida.DTOs.Clase;
using Joki.LogicaNegocio.Entidades;
using Joki.LogicaNegocio.Enums;
using Joki.LogicaNegocio.ValueObjects;

namespace Joki.LogicaAplicacion.Mappers
{
    public class MapperClase
    {
        public static Clase ToEntity(CrearClaseRequest request)
        {
            return new Clase
            {
                GrupoId = request.GrupoId,

                DiaSemana = request.DiaSemana,

                HoraInicio = request.HoraInicio,

                HoraFin = request.HoraFin,

                Ubicacion = new Ubicacion
                {
                    Latitud = request.Latitud,
                    Longitud = request.Longitud,
                    CodigoPostal = request.CodigoPostal
                },

                RadioGeolocalizacion =
                    request.RadioGeolocalizacion,

                EsFija = request.EsFija,

                FechaInicio = request.FechaInicio,

                FechaFin = request.FechaFin,

                CupoMaximo = request.CupoMaximo,

                Estado = EstadoClase.Programada
            };
        }

        public static ClaseResponse ToResponse(Clase clase)
        {
            return new ClaseResponse
            {
                Id = clase.Id,

                GrupoId = clase.GrupoId,
                GrupoNombre = clase.Grupo?.Nombre,
                UbicacionNombre =
    string.IsNullOrWhiteSpace(clase.Ubicacion.Direccion)
        ? clase.Ubicacion.CodigoPostal
        : clase.Ubicacion.Direccion,

                EntrenadorNombre =
    clase.Grupo?.Entrenador == null
        ? null
        : $"{clase.Grupo.Entrenador.Nombre.Valor} {clase.Grupo.Entrenador.Apellido.Valor}",

                DiaSemana = clase.DiaSemana.ToString(),

                HoraInicio = clase.HoraInicio,

                HoraFin = clase.HoraFin,

                Latitud = clase.Ubicacion.Latitud,

                Longitud = clase.Ubicacion.Longitud,

                CodigoPostal = clase.Ubicacion.CodigoPostal,

                RadioGeolocalizacion =
                    clase.RadioGeolocalizacion,

                EsFija = clase.EsFija,

                FechaInicio = clase.FechaInicio,

                FechaFin = clase.FechaFin,

                CupoMaximo = clase.CupoMaximo,

                Estado = clase.Estado.ToString(),

                CantidadInscriptos = clase.Inscripciones.Count
            };
        }

        public static void UpdateEntity(
            Clase clase,
            EditarClaseRequest request)
        {
            clase.GrupoId = request.GrupoId;

            clase.DiaSemana = request.DiaSemana;

            clase.HoraInicio = request.HoraInicio;

            clase.HoraFin = request.HoraFin;

            clase.Ubicacion = new Ubicacion
            {
                Latitud = request.Latitud,
                Longitud = request.Longitud,
                CodigoPostal = request.CodigoPostal
            };

            clase.RadioGeolocalizacion =
                request.RadioGeolocalizacion;

            clase.EsFija = request.EsFija;

            clase.FechaInicio = request.FechaInicio;

            clase.FechaFin = request.FechaFin;

            clase.CupoMaximo = request.CupoMaximo;
        }
    }
}