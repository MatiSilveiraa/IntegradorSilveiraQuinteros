using Joki.CasoUsoCompartida.DTOs.Auditoria;
using Joki.CasoUsoCompartida.InterfacesCasosUso.Auditoria;
using AuditoriaEntidad = Joki.LogicaNegocio.Entidades.Auditoria;
using Joki.LogicaNegocio.InterfacesRepositorio;

namespace Joki.LogicaAplicacion.CasosDeUso.Auditoria
{
    public class ResolverAuditoriaResponse :
        IResolverAuditoriaResponse
    {
        private readonly IRepositorioUsuario _repositorioUsuario;
        private readonly IRepositorioClase _repositorioClase;
        private readonly IRepositorioGrupo _repositorioGrupo;
        private readonly IRepositorioDesafio _repositorioDesafio;
        private readonly IRepositorioDescuento _repositorioDescuento;
        private readonly IRepositorioBeneficio _repositorioBeneficio;
        private readonly IRepositorioCuota _repositorioCuota;
        private readonly IRepositorioAlumno _repositorioAlumno;
        private readonly IRepositorioPago _repositorioPago;

        public ResolverAuditoriaResponse(
            IRepositorioUsuario repositorioUsuario,
            IRepositorioClase repositorioClase,
            IRepositorioGrupo repositorioGrupo,
            IRepositorioDesafio repositorioDesafio,
            IRepositorioDescuento repositorioDescuento,
            IRepositorioBeneficio repositorioBeneficio,
            IRepositorioCuota repositorioCuota,
            IRepositorioAlumno repositorioAlumno,
            IRepositorioPago repositorioPago)
        {
            _repositorioUsuario = repositorioUsuario;
            _repositorioClase = repositorioClase;
            _repositorioGrupo = repositorioGrupo;
            _repositorioDesafio = repositorioDesafio;
            _repositorioDescuento = repositorioDescuento;
            _repositorioBeneficio = repositorioBeneficio;
            _repositorioCuota = repositorioCuota;
            _repositorioAlumno = repositorioAlumno;
            _repositorioPago = repositorioPago;
        }

        public AuditoriaResponse Resolver(AuditoriaEntidad auditoria)
        {
            var usuario =
                _repositorioUsuario.ObtenerPorId(auditoria.UsuarioId);

            return new AuditoriaResponse
            {
                Id = auditoria.Id,
                UsuarioId = auditoria.UsuarioId,
                UsuarioNombre = usuario == null
                    ? null
                    : $"{usuario.Nombre.Valor} {usuario.Apellido.Valor}",
                UsuarioEmail = usuario?.Email.Valor,
                Entidad = auditoria.Entidad,
                EntidadId = auditoria.EntidadId,
                EntidadNombre = ObtenerEntidadNombre(
                    auditoria.Entidad,
                    auditoria.EntidadId),
                Accion = auditoria.Accion,
                Fecha = auditoria.Fecha
            };
        }

        private string? ObtenerEntidadNombre(
            string entidad,
            int entidadId)
        {
            return entidad switch
            {
                "Clase" => ObtenerNombreClase(entidadId),
                "Grupo" => ObtenerNombreGrupo(entidadId),
                "Desafio" => ObtenerNombreDesafio(entidadId),
                "Descuento" => ObtenerNombreDescuento(entidadId),
                "Beneficio" => ObtenerNombreBeneficio(entidadId),
                "Cuota" => ObtenerNombreCuota(entidadId),
                "Pago" => ObtenerNombrePago(entidadId),
                "Alumno" => ObtenerNombreAlumno(entidadId),
                "ConfiguracionCuota" => "Configuración de cuota",
                "SolicitudReactivacion" => $"Solicitud de reactivación #{entidadId}",
                _ => null
            };
        }

        private string? ObtenerNombreClase(int claseId)
        {
            var clase =
                _repositorioClase.ObtenerPorId(claseId);

            if (clase == null)
            {
                return null;
            }

            var grupo =
                _repositorioGrupo.ObtenerPorId(clase.GrupoId);

            string nombreGrupo =
                grupo != null
                    ? $" - {grupo.Nombre}"
                    : string.Empty;

            return $"{clase.DiaSemana} {clase.HoraInicio:hh\\:mm} - {clase.HoraFin:hh\\:mm}{nombreGrupo}";
        }

        private string? ObtenerNombreGrupo(int grupoId)
        {
            var grupo =
                _repositorioGrupo.ObtenerPorId(grupoId);

            return grupo?.Nombre;
        }

        private string? ObtenerNombreDesafio(int desafioId)
        {
            var desafio =
                _repositorioDesafio.ObtenerPorId(desafioId);

            return desafio?.Titulo;
        }

        private string? ObtenerNombreDescuento(int descuentoId)
        {
            var descuento =
                _repositorioDescuento.ObtenerPorId(descuentoId);

            return descuento?.Nombre;
        }

        private string? ObtenerNombreBeneficio(int beneficioId)
        {
            var beneficio =
                _repositorioBeneficio.ObtenerPorId(beneficioId);

            return beneficio?.DescripcionBeneficio;
        }

        private string? ObtenerNombreCuota(int cuotaId)
        {
            var cuota =
                _repositorioCuota.ObtenerPorId(cuotaId);

            if (cuota == null)
            {
                return null;
            }

            var alumno =
                _repositorioAlumno.ObtenerPorId(cuota.AlumnoId);

            string nombreAlumno =
                alumno == null
                    ? $"Alumno #{cuota.AlumnoId}"
                    : $"{alumno.Nombre.Valor} {alumno.Apellido.Valor}";

            return $"{nombreAlumno} - Cuota {cuota.Mes}/{cuota.Anio}";
        }

        private string? ObtenerNombrePago(int pagoId)
        {
            var pago =
                _repositorioPago.ObtenerPorId(pagoId);

            if (pago == null)
            {
                return null;
            }

            return ObtenerNombreCuota(pago.CuotaId);
        }

        private string? ObtenerNombreAlumno(int alumnoId)
        {
            var alumno =
                _repositorioAlumno.ObtenerPorId(alumnoId);

            if (alumno == null)
            {
                return null;
            }

            return $"{alumno.Nombre.Valor} {alumno.Apellido.Valor}";
        }
    }
}