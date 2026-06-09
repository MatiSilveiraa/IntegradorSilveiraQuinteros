using Joki.CasoUsoCompartida.DTOs.Descuento;
using Joki.CasoUsoCompartida.InterfacesCasosUso.Descuento;
using Joki.LogicaNegocio.Enums;
using Joki.LogicaNegocio.Excepciones;
using Joki.LogicaNegocio.InterfacesRepositorio;

using Entidades = Joki.LogicaNegocio.Entidades;

namespace Joki.LogicaAplicacion.CasosDeUso.Descuento
{
    public class CrearDescuento : ICrearDescuento
    {
        private readonly IRepositorioDescuento _repositorioDescuento;
        private readonly IRepositorioBeneficio _repositorioBeneficio;
        private readonly IRepositorioAlumno _repositorioAlumno;

        public CrearDescuento(
            IRepositorioDescuento repositorioDescuento,
            IRepositorioBeneficio repositorioBeneficio,
            IRepositorioAlumno repositorioAlumno)
        {
            _repositorioDescuento = repositorioDescuento;
            _repositorioBeneficio = repositorioBeneficio;
            _repositorioAlumno = repositorioAlumno;
        }

        public void Ejecutar(CrearDescuentoRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.Nombre))
            {
                throw new LogicaNegocioException("El nombre del descuento es obligatorio");
            }

            if (request.Porcentaje <= 0 || request.Porcentaje > 100)
            {
                throw new LogicaNegocioException("El porcentaje debe estar entre 1 y 100");
            }

            if (request.MesesDuracion <= 0)
            {
                throw new LogicaNegocioException("La duración debe ser mayor a cero");
            }

            TipoDescuento tipo =
                Enum.Parse<TipoDescuento>(request.Tipo, true);

            AlcanceDescuento alcance =
                Enum.Parse<AlcanceDescuento>(request.Alcance, true);

            var descuento =
                new Entidades.Descuento
                {
                    Nombre = request.Nombre,
                    Descripcion = request.Descripcion,
                    Porcentaje = request.Porcentaje,
                    MesesDuracion = request.MesesDuracion,
                    Tipo = tipo,
                    Alcance = alcance,
                    DesafioId = request.DesafioId,
                    Activo = true
                };

            _repositorioDescuento.Agregar(descuento);

            List<Entidades.Alumno> alumnos =
                new List<Entidades.Alumno>();

            if (alcance == AlcanceDescuento.TODOS)
            {
                alumnos =
                    _repositorioAlumno.ObtenerActivos()
                        .ToList();
            }
            else
            {
                foreach (int alumnoId in request.AlumnosIds)
                {
                    var alumno =
                        _repositorioAlumno.ObtenerPorId(alumnoId);

                    if (alumno != null)
                    {
                        alumnos.Add(alumno);
                    }
                }
            }

            foreach (var alumno in alumnos)
            {
                var beneficio =
                    new Entidades.Beneficio
                    {
                        AlumnoId = alumno.UsuarioId,
                        DescuentoId = descuento.Id,
                        DescripcionBeneficio = descuento.Nombre,
                        MesesDuracion = descuento.MesesDuracion,
                        MesesAplicados = 0,
                        Estado = EstadoBeneficio.PENDIENTE
                    };

                _repositorioBeneficio.Agregar(beneficio);
            }
        }
    }
}