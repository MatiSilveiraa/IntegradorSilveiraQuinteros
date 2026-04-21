using Joki.LogicaNegocio.Entidades;
using Joki.LogicaNegocio.Enums;
using Joki.LogicaNegocio.ValueObjects;

namespace Joki.Infraestructura.AccesoDatos.EF
{
    public class SeedData
    {
        private readonly JokiContext _context;

        public SeedData(JokiContext context)
        {
            _context = context;
        }

        public void Run()
        {
            Usuarios();
            Grupos();
            Inscripciones();
            Cuotas();
            Desafios();
        }

        // =========================
        // USUARIOS
        // =========================
        private void Usuarios()
        {
            var entrenador = new Entrenador
            {
                Nombre = new Nombre("Carlos"),
                Apellido = new Apellido("Gomez"),
                Email = new Email("carlos@joki.com"),
                PasswordHash = "123",
                ProveedorAutenticacion = "LOCAL",
                Estado = EstadoUsuario.ACTIVO,
                EsPrincipal = true
            };

            var alumno1 = new Alumno
            {
                Nombre = new Nombre("Juan"),
                Apellido = new Apellido("Perez"),
                Email = new Email("juan@test.com"),
                PasswordHash = "123",
                ProveedorAutenticacion = "LOCAL",
                Estado = EstadoUsuario.ACTIVO,
                Peso = 70m,
                Estatura = 1.75m
            };

            var alumno2 = new Alumno
            {
                Nombre = new Nombre("Maria"),
                Apellido = new Apellido("Lopez"),
                Email = new Email("maria@test.com"),
                PasswordHash = "123",
                ProveedorAutenticacion = "LOCAL",
                Estado = EstadoUsuario.ACTIVO,
                Peso = 60m,
                Estatura = 1.65m
            };

            _context.Usuarios.AddRange(entrenador, alumno1, alumno2);
            //_context.SaveChanges();
        }

        // =========================
        // GRUPOS
        // =========================
        private void Grupos()
        {
            var entrenador = _context.Set<Entrenador>().First();

            var grupo = new Grupo
            {
                Nombre = "Funcional Mañana",
                Nivel = "Intermedio",
                CupoMaximo = 20,

                DiaSemana = DiaSemana.Lunes, // ✅ enum
                Hora = new TimeSpan(9, 0, 0), // ✅ 09:00

                Ubicacion = new Ubicacion
                {
                    Latitud = -34.90m,
                    Longitud = -56.16m,
                    CodigoPostal = "11000"
                },

                RadioGeolocalizacion = 100m, // ✅ decimal

                EsFijo = true,

                FechaInicio = DateTime.Now, // ✅ DateTime
                FechaFin = DateTime.Now.AddMonths(3), // nullable ok

                Estado = EstadoGrupo.ACTIVO,
                EntrenadorId = entrenador.UsuarioId
            };

            _context.Grupos.Add(grupo);
            //_context.SaveChanges();
        }

        // =========================
        // INSCRIPCIONES
        // =========================
        private void Inscripciones()
        {
            var alumno = _context.Set<Alumno>().First();
            var grupo = _context.Grupos.First();

            var inscripcion = new Inscripcion
            {
                AlumnoId = alumno.UsuarioId,
                GrupoId = grupo.Id
            };

            _context.Inscripciones.Add(inscripcion);
            //_context.SaveChanges();
        }

        // =========================
        // CUOTAS + PAGOS
        // =========================
        private void Cuotas()
        {
            var alumno = _context.Set<Alumno>().First();

            var cuota = new Cuota
            {
                AlumnoId = alumno.UsuarioId,
                Mes = 4,
                Anio = 2026,
                MontoBase = 2000,
                Descuento = 0,
                MontoFinal = 2000,
                Estado = EstadoCuota.PENDIENTE
            };

            _context.Cuotas.Add(cuota);
            //_context.SaveChanges();

            var pago = new Pago
            {
                CuotaId = cuota.Id,
                MedioPago = MedioPago.EFECTIVO,
                FechaPago = DateTime.Now,
                Monto = 2000
            };

            _context.Pagos.Add(pago);
            //_context.SaveChanges();
        }

        // =========================
        // DESAFIOS
        // =========================
        private void Desafios()
        {
            var desafio = new Desafio
            {
                Titulo = "Desafío 30 días",
                Descripcion = "Entrenar 30 días seguidos",
                FechaInicio = DateTime.Now,
                FechaFin = DateTime.Now.AddDays(30)
            };

            _context.Desafios.Add(desafio);
            //_context.SaveChanges();
        }
    }
}