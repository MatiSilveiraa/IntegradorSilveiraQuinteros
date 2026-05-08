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

            if (!_context.Clases.Any()) Clases();

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
            var hasheador =
                new PasswordHasher<object>();

            var rolAdmin =
                _context.Roles.First(r => r.Nombre == "Admin");

            var rolEntrenador =
                _context.Roles.First(r => r.Nombre == "Entrenador");

            var rolAlumno =
                _context.Roles.First(r => r.Nombre == "Alumno");

            var usuarios = new List<Usuario>
            {
                new Entrenador
                {
                    Nombre = new Nombre("Carlos"),

                    Apellido = new Apellido("Gomez"),

                    Email = new Email("admin@joki.com"),

                    Contrasena =
                        Contrasena.FromHash(
                            hasheador.HashPassword(
                                null,
                                "Admin#123")),

                    ProveedorAutenticacion = "LOCAL",

                    Estado = EstadoUsuario.ACTIVO,

                    RolId = rolAdmin.Id,

                    Genero = Genero.MASCULINO,

                    FechaNacimiento =
                        new DateTime(1988, 5, 10),

                    Celular =
                        Celular.Crear("099111111"),

                    SociedadMedica = "CASMU"
                },

                new Entrenador
                {
                    Nombre = new Nombre("Lucia"),

                    Apellido = new Apellido("Fernandez"),

                    Email = new Email("entrenador@joki.com"),

                    Contrasena =
                        Contrasena.FromHash(
                            hasheador.HashPassword(
                                null,
                                "Entrenador#123")),

                    ProveedorAutenticacion = "LOCAL",

                    Estado = EstadoUsuario.ACTIVO,

                    RolId = rolEntrenador.Id,

                    Genero = Genero.FEMENINO,

                    FechaNacimiento =
                        new DateTime(1992, 9, 22),

                    Celular =
                        Celular.Crear("099222222"),

                    SociedadMedica = "MP"
                },

                new Alumno
                {
                    Nombre = new Nombre("Juan"),

                    Apellido = new Apellido("Perez"),

                    Email = new Email("juan@test.com"),

                    Contrasena =
                        Contrasena.FromHash(
                            hasheador.HashPassword(
                                null,
                                "Juan#123")),

                    ProveedorAutenticacion = "LOCAL",

                    Estado = EstadoUsuario.ACTIVO,

                    RolId = rolAlumno.Id,

                    Genero = Genero.MASCULINO,

                    FechaNacimiento =
                        new DateTime(2000, 3, 15),

                    Celular =
                        Celular.Crear("099333333"),

                    SociedadMedica = "ASSE",

                    Peso = 70m,

                    Estatura = 1.75m
                },

                new Alumno
                {
                    Nombre = new Nombre("Maria"),

                    Apellido = new Apellido("Lopez"),

                    Email = new Email("maria@test.com"),

                    Contrasena =
                        Contrasena.FromHash(
                            hasheador.HashPassword(
                                null,
                                "Maria#123")),

                    ProveedorAutenticacion = "LOCAL",

                    Estado = EstadoUsuario.ACTIVO,

                    RolId = rolAlumno.Id,

                    Genero = Genero.FEMENINO,

                    FechaNacimiento =
                        new DateTime(1999, 7, 8),

                    Celular =
                        Celular.Crear("099444444"),

                    SociedadMedica = "SMI",

                    Peso = 60m,

                    Estatura = 1.65m
                },

                new Alumno
                {
                    Nombre = new Nombre("Pedro"),

                    Apellido = new Apellido("Garcia"),

                    Email = new Email("pedro@test.com"),

                    Contrasena =
                        Contrasena.FromHash(
                            hasheador.HashPassword(
                                null,
                                "Pedro#123")),

                    ProveedorAutenticacion = "LOCAL",

                    Estado = EstadoUsuario.ACTIVO,

                    RolId = rolAlumno.Id,

                    Genero = Genero.MASCULINO,

                    FechaNacimiento =
                        new DateTime(1995, 11, 20),

                    Celular =
                        Celular.Crear("099555555"),

                    SociedadMedica = "MUCAM",

                    Peso = 75m,

                    Estatura = 1.80m
                }
            };

            _context.Usuarios.AddRange(usuarios);

            _context.SaveChanges();
        }

        // =========================
        // GRUPOS 🏋️
        // =========================
        private void Grupos()
        {
            var entrenador =
                _context.Set<Entrenador>().First();

            var grupos = new List<Grupo>
            {
                new Grupo
                {
                    Nombre = "Funcional Mañana",

                    Nivel = "Intermedio",

                    Estado = EstadoGrupo.ACTIVO,

                    EntrenadorId = entrenador.UsuarioId
                },

                new Grupo
                {
                    Nombre = "Funcional Tarde",

                    Nivel = "Avanzado",

                    Estado = EstadoGrupo.ACTIVO,

                    EntrenadorId = entrenador.UsuarioId
                }
            };

            _context.Grupos.AddRange(grupos);

            _context.SaveChanges();
        }

        // =========================
        // CLASES 📚
        // =========================
        private void Clases()
        {
            var grupos =
                _context.Grupos.ToList();

            var grupo1 = grupos.First();

            var grupo2 = grupos.Last();

            var clases = new List<Clase>
            {
                new Clase
                {
                    GrupoId = grupo1.Id,

                    DiaSemana = DiaSemana.Lunes,

                    HoraInicio =
                        new TimeSpan(9, 0, 0),

                    HoraFin =
                        new TimeSpan(10, 0, 0),

                    CupoMaximo = 2,

                    Ubicacion = new Ubicacion
                    {
                        Latitud = -34.90m,

                        Longitud = -56.16m,

                        CodigoPostal = "11000"
                    },

                    RadioGeolocalizacion = 100,

                    EsFija = true,

                    FechaInicio = DateTime.Now,

                    FechaFin =
                        DateTime.Now.AddMonths(3),

                    Estado =
                        EstadoClase.Programada
                },

                new Clase
                {
                    GrupoId = grupo2.Id,

                    DiaSemana = DiaSemana.Lunes,

                    HoraInicio =
                        new TimeSpan(9, 0, 0),

                    HoraFin =
                        new TimeSpan(10, 0, 0),

                    CupoMaximo = 5,

                    Ubicacion = new Ubicacion
                    {
                        Latitud = -34.91m,

                        Longitud = -56.17m,

                        CodigoPostal = "11000"
                    },

                    RadioGeolocalizacion = 100,

                    EsFija = true,

                    FechaInicio = DateTime.Now,

                    FechaFin =
                        DateTime.Now.AddMonths(3),

                    Estado =
                        EstadoClase.Programada
                }
            };

            _context.Clases.AddRange(clases);

            _context.SaveChanges();
        }

        // =========================
        // INSCRIPCIONES 📝
        // =========================
        private void Inscripciones()
        {
            var alumnos =
                _context.Set<Alumno>().ToList();

            var clases =
                _context.Clases.ToList();

            var clase1 =
                clases.First();

            _context.Inscripciones.Add(
                new Inscripcion
                {
                    AlumnoId =
                        alumnos[0].UsuarioId,

                    ClaseId = clase1.Id,

                    FechaInscripcion =
                        DateTime.Now
                });

            _context.Inscripciones.Add(
                new Inscripcion
                {
                    AlumnoId =
                        alumnos[1].UsuarioId,

                    ClaseId = clase1.Id,

                    FechaInscripcion =
                        DateTime.Now
                });

            _context.SaveChanges();
        }

        // =========================
        // CUOTAS 💰
        // =========================
        private void Cuotas()
        {
            var alumno =
                _context.Set<Alumno>().First();

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
        // DESAFIOS 🎯
        // =========================
        private void Desafios()
        {
            _context.Desafios.Add(
                new Desafio
                {
                    Titulo = "Desafío 30 días",

                    Descripcion =
                        "Entrenar 30 días seguidos",

                    FechaInicio = DateTime.Now,

                    FechaFin =
                        DateTime.Now.AddDays(30)
                });

            _context.SaveChanges();
        }
    }
}