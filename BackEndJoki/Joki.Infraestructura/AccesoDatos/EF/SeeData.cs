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
            if (!_context.Roles.Any()) Roles();
            if (!_context.Usuarios.Any()) Usuarios();
            if (!_context.Grupos.Any()) Grupos();
            if (!_context.Inscripciones.Any()) Inscripciones();
            if (!_context.Cuotas.Any()) Cuotas();
            if (!_context.Desafios.Any()) Desafios();
        }

        // =========================
        // ROLES 🔐
        // =========================
        private void Roles()
        {
            var roles = new List<Rol>
            {
                new Rol { Nombre = "Admin" },
                new Rol { Nombre = "Entrenador" },
                new Rol { Nombre = "Alumno" }
            };

            _context.Roles.AddRange(roles);
            _context.SaveChanges();
        }

        // =========================
        // USUARIOS 👤
        // =========================
        private void Usuarios()
        {
            var hasheador = new PasswordHasher<object>();

            var rolAdmin = _context.Roles.First(r => r.Nombre == "Admin");
            var rolEntrenador = _context.Roles.First(r => r.Nombre == "Entrenador");
            var rolAlumno = _context.Roles.First(r => r.Nombre == "Alumno");

            var usuarios = new List<Usuario>
            {
                // ADMIN (Entrenador principal)
                new Entrenador
                {
                    Nombre = new Nombre("Carlos"),
                    Apellido = new Apellido("Gomez"),
                    Email = new Email("admin@joki.com"),
                    Contrasena = Contrasena.FromHash(hasheador.HashPassword(null, "Admin#123")),
                    ProveedorAutenticacion = "LOCAL",
                    Estado = EstadoUsuario.ACTIVO,
                    RolId = rolAdmin.Id, // 🔥
                    Genero = Genero.MASCULINO,
                    FechaNacimiento = new DateTime(1988, 5, 10),
                    Celular = Celular.Crear("099111111"), 
                    SociedadMedica = "CASMU"
                },

                // ENTRENADOR
                new Entrenador
                {
                    Nombre = new Nombre("Lucia"),
                    Apellido = new Apellido("Fernandez"),
                    Email = new Email("entrenador@joki.com"),
                    Contrasena = Contrasena.FromHash(hasheador.HashPassword(null, "Entrenador#123")),
                    ProveedorAutenticacion = "LOCAL",
                    Estado = EstadoUsuario.ACTIVO,
                    RolId = rolEntrenador.Id,
                    Genero = Genero.FEMENINO,
                    FechaNacimiento = new DateTime(1992, 9, 22),
                    Celular = Celular.Crear("099222222"), 
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
                    RolId = rolAlumno.Id,
                    Genero = Genero.MASCULINO,
                    FechaNacimiento = new DateTime(2000, 3, 15),
                    Celular = Celular.Crear("099333333"), 
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
                    RolId = rolAlumno.Id,
                    Genero = Genero.FEMENINO,
                    FechaNacimiento = new DateTime(1999, 7, 8),
                    Celular = Celular.Crear("099444444"), 
                    SociedadMedica = "SMI",
                    Peso = 60m,
                    Estatura = 1.65m
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
                DiaSemana = DiaSemana.Lunes,
                Hora = new TimeSpan(9, 0, 0),

                Ubicacion = new Ubicacion
                {
                    Latitud = -34.90m,
                    Longitud = -56.16m,
                    CodigoPostal = "11000"
                },

                RadioGeolocalizacion = 100m,
                EsFijo = true,
                FechaInicio = DateTime.Now,
                FechaFin = DateTime.Now.AddMonths(3),
                Estado = EstadoGrupo.ACTIVO,
                EntrenadorId = entrenador.UsuarioId
            };

            _context.Grupos.Add(grupo);
            _context.SaveChanges();
        }

        // =========================
        private void Inscripciones()
        {
            var alumno = _context.Set<Alumno>().First();
            var grupo = _context.Grupos.First();

            _context.Inscripciones.Add(new Inscripcion
            {
                AlumnoId = alumno.UsuarioId,
                GrupoId = grupo.Id
            });

            _context.SaveChanges();
        }

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
                MontoFinal = 2000,
                Estado = EstadoCuota.PENDIENTE
            };

            _context.Cuotas.Add(cuota);
            _context.SaveChanges();
        }

        // =========================
        private void Desafios()
        {
            _context.Desafios.Add(new Desafio
            {
                Titulo = "Desafío 30 días",
                Descripcion = "Entrenar 30 días seguidos",
                FechaInicio = DateTime.Now,
                FechaFin = DateTime.Now.AddDays(30)
            });

            _context.SaveChanges();
        }
    }
}