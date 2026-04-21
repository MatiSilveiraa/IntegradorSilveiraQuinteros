using Joki.LogicaNegocio.Entidades;
using Joki.LogicaNegocio.Enums;
using Joki.LogicaNegocio.ValueObjects;
using Microsoft.AspNetCore.Identity;

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
            if (!_context.Usuarios.Any()) Usuarios();
            if (!_context.Grupos.Any()) Grupos();
            if (!_context.Inscripciones.Any()) Inscripciones();
            if (!_context.Cuotas.Any()) Cuotas();
            if (!_context.Desafios.Any()) Desafios();
        }

        // =========================
        // USUARIOS
        // =========================
        private void Usuarios()
        {
            var hasheador = new PasswordHasher<object>();

            var usuarios = new List<Usuario>
    {
        // ENTRENADORES
        new Entrenador
        {
            Nombre = new Nombre("Carlos"),
            Apellido = new Apellido("Gomez"),
            Email = new Email("carlos@joki.com"),
            Contrasena = Contrasena.FromHash(hasheador.HashPassword(null, "Carlos#123")),
            ProveedorAutenticacion = "LOCAL",
            Estado = EstadoUsuario.ACTIVO,
            EsPrincipal = true,
            Genero = Genero.MASCULINO,
            FechaNacimiento = new DateTime(1988, 5, 10),
            Celular = "099111111",
            SociedadMedica = "CASMU"
        },

        new Entrenador
        {
            Nombre = new Nombre("Lucia"),
            Apellido = new Apellido("Fernandez"),
            Email = new Email("lucia@joki.com"),
            Contrasena = Contrasena.FromHash(hasheador.HashPassword(null, "Lucia#123")),
            ProveedorAutenticacion = "LOCAL",
            Estado = EstadoUsuario.ACTIVO,
            EsPrincipal = false,
            Genero = Genero.FEMENINO,
            FechaNacimiento = new DateTime(1992, 9, 22),
            Celular = "099222222",
            SociedadMedica = "MP"
        },

        // ALUMNOS
        new Alumno
        {
            Nombre = new Nombre("Juan"),
            Apellido = new Apellido("Perez"),
            Email = new Email("juan@test.com"),
            Contrasena = Contrasena.FromHash(hasheador.HashPassword(null, "Juan#123")),
            ProveedorAutenticacion = "LOCAL",
            Estado = EstadoUsuario.ACTIVO,
            Genero = Genero.MASCULINO,
            FechaNacimiento = new DateTime(2000, 3, 15),
            Celular = "099333333",
            SociedadMedica = "ASSE",
            Peso = 70m,
            Estatura = 1.75m
        },

        new Alumno
        {
            Nombre = new Nombre("Maria"),
            Apellido = new Apellido("Lopez"),
            Email = new Email("maria@test.com"),
            Contrasena = Contrasena.FromHash(hasheador.HashPassword(null, "Maria#123")),
            ProveedorAutenticacion = "LOCAL",
            Estado = EstadoUsuario.ACTIVO,
            Genero = Genero.FEMENINO,
            FechaNacimiento = new DateTime(1999, 7, 8),
            Celular = "099444444",
            SociedadMedica = "SMI",
            Peso = 60m,
            Estatura = 1.65m
        },

        new Alumno
        {
            Nombre = new Nombre("Matias"),
            Apellido = new Apellido("Silveira"),
            Email = new Email("matias@test.com"),
            Contrasena = Contrasena.FromHash(hasheador.HashPassword(null, "Matias#123")),
            ProveedorAutenticacion = "LOCAL",
            Estado = EstadoUsuario.ACTIVO,
            Genero = Genero.MASCULINO,
            FechaNacimiento = new DateTime(1998, 11, 2),
            Celular = "099555555",
            SociedadMedica = "COMEPA",
            Peso = 78m,
            Estatura = 1.80m
        },

        new Alumno
        {
            Nombre = new Nombre("Camila"),
            Apellido = new Apellido("Rodriguez"),
            Email = new Email("camila@test.com"),
            Contrasena = Contrasena.FromHash(hasheador.HashPassword(null, "Camila#123")),
            ProveedorAutenticacion = "LOCAL",
            Estado = EstadoUsuario.ACTIVO,
            Genero = Genero.FEMENINO,
            FechaNacimiento = new DateTime(2001, 1, 25),
            Celular = "099666666",
            SociedadMedica = "CASMU",
            Peso = 58m,
            Estatura = 1.62m
        },

        new Alumno
        {
            Nombre = new Nombre("Bruno"),
            Apellido = new Apellido("Alonso"),
            Email = new Email("bruno@test.com"),
            Contrasena = Contrasena.FromHash(hasheador.HashPassword(null, "Bruno#123")),
            ProveedorAutenticacion = "LOCAL",
            Estado = EstadoUsuario.ACTIVO,
            Genero = Genero.MASCULINO,
            FechaNacimiento = new DateTime(1997, 6, 18),
            Celular = "099777777",
            SociedadMedica = "BLUECROSS",
            Peso = 82m,
            Estatura = 1.84m
        },

        new Alumno
        {
            Nombre = new Nombre("Valentina"),
            Apellido = new Apellido("Suarez"),
            Email = new Email("valentina@test.com"),
            Contrasena = Contrasena.FromHash(hasheador.HashPassword(null, "Valentina#123")),
            ProveedorAutenticacion = "LOCAL",
            Estado = EstadoUsuario.ACTIVO,
            Genero = Genero.FEMENINO,
            FechaNacimiento = new DateTime(2002, 4, 30),
            Celular = "099888888",
            SociedadMedica = "MP",
            Peso = 55m,
            Estatura = 1.60m
        }
    };

            _context.Usuarios.AddRange(usuarios);
            _context.SaveChanges();
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
            _context.SaveChanges();
        }

        // =========================
        // INSCRIPCIONES
        // =========================
        private void Inscripciones()
        {
            var alumno = _context.Set<Alumno>().FirstOrDefault();
            var grupo = _context.Grupos.FirstOrDefault();

            if (alumno == null || grupo == null)
            {
                return;
            }

            var inscripcion = new Inscripcion
            {
                AlumnoId = alumno.UsuarioId,
                GrupoId = grupo.Id
            };

            _context.Inscripciones.Add(inscripcion);
            _context.SaveChanges();
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
            _context.SaveChanges();

            var pago = new Pago
            {
                CuotaId = cuota.Id,
                MedioPago = MedioPago.EFECTIVO,
                FechaPago = DateTime.Now,
                Monto = 2000
            };

            _context.Pagos.Add(pago);
            _context.SaveChanges();
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
            _context.SaveChanges();
        }
    }
}