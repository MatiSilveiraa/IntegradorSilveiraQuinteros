using Joki.LogicaNegocio.Entidades;
using Joki.LogicaNegocio.Enums;
using Joki.LogicaNegocio.ValueObjects;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace Joki.Infraestructura.AccesoDatos.EF
{
    public class SeedDataDemo
    {
        private readonly JokiContext _context;
        private readonly PasswordHasher<object> _hasheador;

        private const string PasswordDemo = "Demo#123";

        public SeedDataDemo(JokiContext context)
        {
            _context = context;
            _hasheador = new PasswordHasher<object>();
        }

        public void Run()
        {
            bool demoYaCreada =
                _context.Usuarios
                    .AsEnumerable()
                    .Any(u =>
                        u.Email.Valor.Equals(
                            "admin@demo.joki.com",
                            StringComparison.OrdinalIgnoreCase));

            if (demoYaCreada)
            {
                return;
            }

            CrearRolesSiNoExisten();
            CrearUsuarios();
            CrearGrupos();
            CrearClases();
            CrearAsignacionesEntrenadoresClases();
            CrearInscripciones();
            CrearAsistencias();
            CrearConfiguracionCuota();
            CrearCuotas();
            CrearPagos();
            CrearDescuentos();
            CrearDesafios();
            CrearRecompensas();
            CrearParticipaciones();
            CrearBeneficios();
            CrearNotificaciones();
        }

        // =====================================================
        // ROLES
        // =====================================================

        private void CrearRolesSiNoExisten()
        {
            if (!_context.Roles.Any(r => r.Nombre == "Admin"))
            {
                _context.Roles.Add(
                    new Rol
                    {
                        Nombre = "Admin"
                    });
            }

            if (!_context.Roles.Any(r => r.Nombre == "Entrenador"))
            {
                _context.Roles.Add(
                    new Rol
                    {
                        Nombre = "Entrenador"
                    });
            }

            if (!_context.Roles.Any(r => r.Nombre == "Alumno"))
            {
                _context.Roles.Add(
                    new Rol
                    {
                        Nombre = "Alumno"
                    });
            }

            _context.SaveChanges();
        }

        // =====================================================
        // USUARIOS
        // =====================================================

        private void CrearUsuarios()
        {
            var rolAdmin =
                _context.Roles.First(
                    r => r.Nombre == "Admin");

            var rolEntrenador =
                _context.Roles.First(
                    r => r.Nombre == "Entrenador");

            var rolAlumno =
                _context.Roles.First(
                    r => r.Nombre == "Alumno");

            var usuarios =
                new List<Usuario>
                {
                    CrearEntrenador(
                        "Administrador",
                        "Joki",
                        "admin@demo.joki.com",
                        "098000001",
                        rolAdmin.Id,
                        Genero.MASCULINO),

                    CrearEntrenador(
                        "Juan",
                        "Rodriguez",
                        "juan.entrenador@demo.joki.com",
                        "098000002",
                        rolEntrenador.Id,
                        Genero.MASCULINO),

                    CrearEntrenador(
                        "Maria",
                        "Fernandez",
                        "maria.entrenadora@demo.joki.com",
                        "098000003",
                        rolEntrenador.Id,
                        Genero.FEMENINO),

                    CrearEntrenador(
                        "Diego",
                        "Silva",
                        "diego.entrenador@demo.joki.com",
                        "098000004",
                        rolEntrenador.Id,
                        Genero.MASCULINO),

                    CrearEntrenador(
                        "Carla",
                        "Suarez",
                        "carla.entrenadora@demo.joki.com",
                        "098000005",
                        rolEntrenador.Id,
                        Genero.FEMENINO)
                };

            usuarios.Add(
                CrearAlumno(
                    "Alumno",
                    "Demo",
                    "demo.alumno@joki.com",
                    "097100001",
                    rolAlumno.Id,
                    Genero.MASCULINO,
                    1));

            usuarios.Add(
                CrearAlumno(
                    "Passwordless",
                    "Demo",
                    "demo.passwordless@joki.com",
                    "097100002",
                    rolAlumno.Id,
                    Genero.FEMENINO,
                    2));

            var alumno2FA =
                CrearAlumno(
                    "Autenticador",
                    "Demo",
                    "demo.2fa@joki.com",
                    "097100003",
                    rolAlumno.Id,
                    Genero.MASCULINO,
                    3);

            alumno2FA.TwoFactorEnabled = true;

            alumno2FA.TwoFactorSecret =
                "M3JBVZ3C3UH7K3QGODB5ES3H7VGMHXAV";

            usuarios.Add(alumno2FA);

            for (int numero = 4;
                 numero <= 50;
                 numero++)
            {
                string texto =
                    numero.ToString("00");

                Genero genero =
                    numero % 2 == 0
                        ? Genero.FEMENINO
                        : Genero.MASCULINO;

                usuarios.Add(
                    CrearAlumno(
                        $"Alumno{texto}",
                        "Demo",
                        $"alumno{texto}@demo.joki.com",
                        $"09710{numero:0000}",
                        rolAlumno.Id,
                        genero,
                        numero));
            }

            _context.Usuarios.AddRange(
                usuarios);

            _context.SaveChanges();
        }

        private Entrenador CrearEntrenador(
            string nombre,
            string apellido,
            string email,
            string celular,
            int rolId,
            Genero genero)
        {
            return new Entrenador
            {
                Nombre =
                    new Nombre(nombre),

                Apellido =
                    new Apellido(apellido),

                Email =
                    new Email(email),

                Contrasena =
                    CrearContrasenaDemo(),

                ProveedorAutenticacion =
                    "LOCAL",

                Estado =
                    EstadoUsuario.ACTIVO,

                RolId =
                    rolId,

                Genero =
                    genero,

                FechaNacimiento =
                    new DateTime(1990, 1, 15),

                Celular =
                    Celular.Crear(celular),

                SociedadMedica =
                    "CASMU",

                TwoFactorEnabled =
                    false
            };
        }

        private Alumno CrearAlumno(
            string nombre,
            string apellido,
            string email,
            string celular,
            int rolId,
            Genero genero,
            int indice)
        {
            decimal peso =
                55m + indice % 35;

            decimal estatura =
                1.55m +
                ((indice % 30) / 100m);

            return new Alumno
            {
                Nombre =
                    new Nombre(nombre),

                Apellido =
                    new Apellido(apellido),

                Email =
                    new Email(email),

                Contrasena =
                    CrearContrasenaDemo(),

                ProveedorAutenticacion =
                    "LOCAL",

                Estado =
                    EstadoUsuario.ACTIVO,

                RolId =
                    rolId,

                Genero =
                    genero,

                FechaNacimiento =
                    new DateTime(
                        1990 + indice % 14,
                        indice % 12 + 1,
                        indice % 25 + 1),

                Celular =
                    Celular.Crear(celular),

                SociedadMedica =
                    ObtenerSociedadMedica(indice),

                Peso =
                    peso,

                Estatura =
                    estatura,

                IMC =
                    Math.Round(
                        peso /
                        (estatura * estatura),
                        2),

                BloqueadoPorInasistencias =
                    indice % 17 == 0,

                RachaAsistenciaMensual =
                    indice % 11,

                MesRachaAsistencia =
                    DateTime.Today.Month,

                AnioRachaAsistencia =
                    DateTime.Today.Year,

                DescuentoRachaGenerado =
                    indice % 10 == 0,

                TwoFactorEnabled =
                    false
            };
        }

        private Contrasena CrearContrasenaDemo()
        {
            string hash =
                _hasheador.HashPassword(
                    null!,
                    PasswordDemo);

            return Contrasena.FromHash(hash);
        }

        private static string ObtenerSociedadMedica(
            int indice)
        {
            string[] sociedades =
            {
                "ASSE",
                "CASMU",
                "MP",
                "SMI",
                "MUCAM"
            };

            return sociedades[
                indice %
                sociedades.Length];
        }

        // =====================================================
        // GRUPOS
        // =====================================================

        private void CrearGrupos()
        {
            var entrenadores =
                _context.Set<Entrenador>()
                    .Where(
                        e =>
                            e.Rol.Nombre ==
                            "Entrenador")
                    .OrderBy(
                        e =>
                            e.UsuarioId)
                    .ToList();

            if (entrenadores.Count < 4)
            {
                throw new InvalidOperationException(
                    "No se encontraron los cuatro entrenadores demo.");
            }

            var grupos =
                new List<Grupo>
                {
                    CrearGrupo(
                        "Funcional Mañana",
                        "Inicial",
                        entrenadores[0].UsuarioId),

                    CrearGrupo(
                        "Funcional Intermedio",
                        "Intermedio",
                        entrenadores[0].UsuarioId),

                    CrearGrupo(
                        "Funcional Tarde",
                        "Intermedio",
                        entrenadores[1].UsuarioId),

                    CrearGrupo(
                        "Funcional Avanzado",
                        "Avanzado",
                        entrenadores[1].UsuarioId),

                    CrearGrupo(
                        "HIIT",
                        "Intermedio",
                        entrenadores[2].UsuarioId),

                    CrearGrupo(
                        "Cross Training",
                        "Avanzado",
                        entrenadores[2].UsuarioId),

                    CrearGrupo(
                        "Running",
                        "Inicial",
                        entrenadores[3].UsuarioId),

                    CrearGrupo(
                        "Grupo Demo Sin Clases",
                        "Inicial",
                        entrenadores[3].UsuarioId)
                };

            _context.Grupos.AddRange(
                grupos);

            _context.SaveChanges();
        }

        private static Grupo CrearGrupo(
            string nombre,
            string nivel,
            int entrenadorId)
        {
            return new Grupo
            {
                Nombre =
                    nombre,

                Nivel =
                    nivel,

                Estado =
                    EstadoGrupo.ACTIVO,

                EntrenadorId =
                    entrenadorId
            };
        }

        // =====================================================
        // CLASES
        // =====================================================

        private void CrearClases()
        {
            var grupos =
                _context.Grupos
                    .Where(
                        g =>
                            g.Nombre !=
                            "Grupo Demo Sin Clases")
                    .OrderBy(
                        g =>
                            g.Id)
                    .ToList();

            if (!grupos.Any())
            {
                return;
            }

            var clases =
                new List<Clase>();

            // =================================================
            // CLASES RECURRENTES ACTIVAS
            // =================================================

            for (int indice = 0;
                 indice < grupos.Count;
                 indice++)
            {
                Grupo grupo =
                    grupos[indice];

                int horaBase =
                    indice % 2 == 0
                        ? 8
                        : 18;

                clases.Add(
                    CrearClaseRecurrente(
                        grupo.Id,
                        DiaSemana.Lunes,
                        horaBase,
                        indice,
                        DateTime.Today.AddMonths(-4),
                        DateTime.Today.AddMonths(4)));

                clases.Add(
                    CrearClaseRecurrente(
                        grupo.Id,
                        DiaSemana.Miercoles,
                        horaBase,
                        indice,
                        DateTime.Today.AddMonths(-4),
                        DateTime.Today.AddMonths(4)));

                clases.Add(
                    CrearClaseRecurrente(
                        grupo.Id,
                        DiaSemana.Viernes,
                        horaBase,
                        indice,
                        DateTime.Today.AddMonths(-4),
                        DateTime.Today.AddMonths(4)));
            }

            // =================================================
            // CLASES RECURRENTES HISTÓRICAS
            // =================================================

            clases.Add(
                CrearClaseRecurrente(
                    grupos[0].Id,
                    DiaSemana.Martes,
                    19,
                    0,
                    DateTime.Today.AddMonths(-8),
                    DateTime.Today.AddMonths(-2)));

            clases.Add(
                CrearClaseRecurrente(
                    grupos[2].Id,
                    DiaSemana.Jueves,
                    20,
                    2,
                    DateTime.Today.AddMonths(-6),
                    DateTime.Today.AddMonths(-1)));

            // =================================================
            // CLASES PUNTUALES REALIZADAS
            // =================================================

            clases.Add(
                CrearClasePuntual(
                    grupos[0].Id,
                    DateTime.Today.AddDays(-3),
                    19,
                    0,
                    EstadoClase.Realizada));

            clases.Add(
                CrearClasePuntual(
                    grupos[1].Id,
                    DateTime.Today.AddDays(-7),
                    18,
                    1,
                    EstadoClase.Realizada));

            clases.Add(
                CrearClasePuntual(
                    grupos[2].Id,
                    DateTime.Today.AddDays(-10),
                    20,
                    2,
                    EstadoClase.Realizada));

            clases.Add(
                CrearClasePuntual(
                    grupos[4].Id,
                    DateTime.Today.AddDays(-15),
                    19,
                    4,
                    EstadoClase.Realizada));

            // =================================================
            // CLASES CANCELADAS
            // =================================================

            clases.Add(
                CrearClasePuntual(
                    grupos[3].Id,
                    DateTime.Today.AddDays(-5),
                    18,
                    3,
                    EstadoClase.Cancelada));

            clases.Add(
                CrearClasePuntual(
                    grupos[5].Id,
                    DateTime.Today.AddDays(5),
                    20,
                    5,
                    EstadoClase.Cancelada));

            // =================================================
            // CLASES SUSPENDIDAS
            // =================================================

            clases.Add(
                CrearClasePuntual(
                    grupos[4].Id,
                    DateTime.Today.AddDays(4),
                    19,
                    4,
                    EstadoClase.Suspendida));

            // =================================================
            // CLASES PUNTUALES FUTURAS
            // =================================================

            clases.Add(
                CrearClasePuntual(
                    grupos[0].Id,
                    DateTime.Today.AddDays(2),
                    20,
                    0,
                    EstadoClase.Programada));

            clases.Add(
                CrearClasePuntual(
                    grupos[1].Id,
                    DateTime.Today.AddDays(8),
                    19,
                    1,
                    EstadoClase.Programada));

            clases.Add(
                CrearClasePuntual(
                    grupos[6].Id,
                    DateTime.Today.AddDays(12),
                    9,
                    6,
                    EstadoClase.Programada));

            // =================================================
            // CLASE GEOLOCALIZACIÓN PARA DEMO
            // =================================================

            clases.Add(
                new Clase
                {
                    GrupoId =
                        grupos.First().Id,

                    DiaSemana =
                        ConvertirDiaSemana(
                            DateTime.Today.DayOfWeek),

                    HoraInicio =
                        DateTime.Now.TimeOfDay
                            .Subtract(
                                TimeSpan.FromMinutes(10)),

                    HoraFin =
                        DateTime.Now.TimeOfDay
                            .Add(
                                TimeSpan.FromMinutes(50)),

                    Ubicacion =
                        new Ubicacion
                        {
                            Latitud =
                                -34.900000m,

                            Longitud =
                                -56.160000m,

                            CodigoPostal =
                                "11000"
                        },

                    RadioGeolocalizacion =
                        500m,

                    EsFija =
                        true,

                    FechaInicio =
                        DateTime.Today.AddMonths(-1),

                    FechaFin =
                        DateTime.Today.AddMonths(3),

                    CupoMaximo =
                        20,

                    Estado =
                        EstadoClase.Programada
                });

            _context.Clases.AddRange(
                clases);

            _context.SaveChanges();
        }

        private static Clase CrearClaseRecurrente(
            int grupoId,
            DiaSemana dia,
            int horaInicio,
            int indiceGrupo,
            DateTime fechaInicio,
            DateTime fechaFin)
        {
            return new Clase
            {
                GrupoId =
                    grupoId,

                DiaSemana =
                    dia,

                HoraInicio =
                    new TimeSpan(
                        horaInicio,
                        0,
                        0),

                HoraFin =
                    new TimeSpan(
                        horaInicio + 1,
                        0,
                        0),

                Ubicacion =
                    CrearUbicacionDemo(
                        indiceGrupo),

                RadioGeolocalizacion =
                    150m,

                EsFija =
                    true,

                FechaInicio =
                    fechaInicio.Date,

                FechaFin =
                    fechaFin.Date,

                CupoMaximo =
                    20,

                Estado =
                    EstadoClase.Programada
            };
        }

        private static Clase CrearClasePuntual(
            int grupoId,
            DateTime fecha,
            int horaInicio,
            int indiceGrupo,
            EstadoClase estado)
        {
            return new Clase
            {
                GrupoId =
                    grupoId,

                DiaSemana =
                    ConvertirDiaSemana(
                        fecha.DayOfWeek),

                HoraInicio =
                    new TimeSpan(
                        horaInicio,
                        0,
                        0),

                HoraFin =
                    new TimeSpan(
                        horaInicio + 1,
                        0,
                        0),

                Ubicacion =
                    CrearUbicacionDemo(
                        indiceGrupo),

                RadioGeolocalizacion =
                    150m,

                EsFija =
                    false,

                FechaInicio =
                    fecha.Date,

                FechaFin =
                    fecha.Date,

                CupoMaximo =
                    20,

                Estado =
                    estado
            };
        }

        private static Ubicacion CrearUbicacionDemo(
            int indiceGrupo)
        {
            return new Ubicacion
            {
                Latitud =
                    -34.900000m +
                    indiceGrupo *
                    0.001000m,

                Longitud =
                    -56.160000m +
                    indiceGrupo *
                    0.001000m,

                CodigoPostal =
                    "11000"
            };
        }

        // =====================================================
        // ENTRENADORES ASIGNADOS A CLASES
        // =====================================================

        private void CrearAsignacionesEntrenadoresClases()
        {
            var clases =
                _context.Clases
                    .OrderBy(
                        c =>
                            c.Id)
                    .ToList();

            var grupos =
                _context.Grupos
                    .OrderBy(
                        g =>
                            g.Id)
                    .ToDictionary(
                        g =>
                            g.Id);

            var entrenadores =
                _context.Set<Entrenador>()
                    .Where(
                        e =>
                            e.Rol.Nombre ==
                            "Entrenador")
                    .OrderBy(
                        e =>
                            e.UsuarioId)
                    .ToList();

            if (!clases.Any() ||
                !grupos.Any() ||
                !entrenadores.Any())
            {
                return;
            }

            var asignaciones =
                new List<ClaseEntrenador>();

            // Entrenador principal del grupo.
            foreach (Clase clase in clases)
            {
                if (!grupos.TryGetValue(
                        clase.GrupoId,
                        out Grupo? grupo))
                {
                    continue;
                }

                asignaciones.Add(
                    new ClaseEntrenador
                    {
                        ClaseId =
                            clase.Id,

                        EntrenadorId =
                            grupo.EntrenadorId,

                        EsPrincipal =
                            true,

                        FechaAsignacion =
                            DateTime.UtcNow
                                .AddMonths(-4)
                    });
            }

            // Algunas clases tienen entrenador secundario.
            for (int indice = 0;
                 indice < Math.Min(
                     8,
                     clases.Count);
                 indice++)
            {
                Clase clase =
                    clases[indice];

                Grupo grupo =
                    grupos[clase.GrupoId];

                var secundario =
                    entrenadores
                        .FirstOrDefault(
                            e =>
                                e.UsuarioId !=
                                grupo.EntrenadorId);

                if (secundario == null)
                {
                    continue;
                }

                asignaciones.Add(
                    new ClaseEntrenador
                    {
                        ClaseId =
                            clase.Id,

                        EntrenadorId =
                            secundario.UsuarioId,

                        EsPrincipal =
                            false,

                        FechaAsignacion =
                            DateTime.UtcNow
                                .AddMonths(-2)
                    });
            }

            _context.ClaseEntrenadores.AddRange(
                asignaciones);

            _context.SaveChanges();
        }

        // =====================================================
        // INSCRIPCIONES
        // =====================================================

        private void CrearInscripciones()
        {
            var alumnos =
                _context.Set<Alumno>()
                    .OrderBy(
                        a =>
                            a.UsuarioId)
                    .ToList();

            var clases =
                _context.Clases
                    .Where(
                        c =>
                            c.Estado !=
                            EstadoClase.Cancelada)
                    .OrderBy(
                        c =>
                            c.Id)
                    .ToList();

            if (!alumnos.Any() ||
                !clases.Any())
            {
                return;
            }

            var inscripciones =
                new List<Inscripcion>();

            for (int indice = 0;
                 indice < alumnos.Count;
                 indice++)
            {
                Alumno alumno =
                    alumnos[indice];

                // Primera clase.
                Clase principal =
                    clases[
                        indice %
                        clases.Count];

                AgregarInscripcionSiNoExiste(
                    inscripciones,
                    alumno.UsuarioId,
                    principal.Id,
                    DateTime.Today
                        .AddMonths(-3)
                        .AddDays(
                            indice % 30));

                // Segunda clase para la mayoría.
                if (indice % 3 != 1)
                {
                    Clase secundaria =
                        clases[
                            (indice + 5) %
                            clases.Count];

                    AgregarInscripcionSiNoExiste(
                        inscripciones,
                        alumno.UsuarioId,
                        secundaria.Id,
                        DateTime.Today
                            .AddMonths(-2));
                }

                // Algunos alumnos tienen tres clases.
                if (indice % 5 == 0)
                {
                    Clase tercera =
                        clases[
                            (indice + 10) %
                            clases.Count];

                    AgregarInscripcionSiNoExiste(
                        inscripciones,
                        alumno.UsuarioId,
                        tercera.Id,
                        DateTime.Today
                            .AddMonths(-1));
                }
            }

            // =================================================
            // GARANTIZAR INSCRIPCIÓN DEMO GEOLOCALIZACIÓN
            // =================================================

            var alumnoDemo =
                alumnos.First(
                    a =>
                        a.Email.Valor ==
                        "demo.alumno@joki.com");

            var claseGeo =
                _context.Clases
                    .OrderByDescending(
                        c =>
                            c.Id)
                    .First();

            AgregarInscripcionSiNoExiste(
                inscripciones,
                alumnoDemo.UsuarioId,
                claseGeo.Id,
                DateTime.Today
                    .AddDays(-20));

            _context.Inscripciones.AddRange(
                inscripciones);

            _context.SaveChanges();
        }

        private static void AgregarInscripcionSiNoExiste(
            List<Inscripcion> inscripciones,
            int alumnoId,
            int claseId,
            DateTime fecha)
        {
            bool existe =
                inscripciones.Any(
                    i =>
                        i.AlumnoId ==
                        alumnoId &&
                        i.ClaseId ==
                        claseId);

            if (existe)
            {
                return;
            }

            inscripciones.Add(
                new Inscripcion
                {
                    AlumnoId =
                        alumnoId,

                    ClaseId =
                        claseId,

                    FechaInscripcion =
                        fecha
                });
        }

        // =====================================================
        // ASISTENCIAS
        // =====================================================

        private void CrearAsistencias()
        {
            var inscripciones =
                _context.Inscripciones
                    .OrderBy(
                        i =>
                            i.Id)
                    .ToList();

            var clases =
                _context.Clases
                    .ToDictionary(
                        c =>
                            c.Id);

            if (!inscripciones.Any() ||
                !clases.Any())
            {
                return;
            }

            int adminId =
                ObtenerAdministradorId();

            var asistencias =
                new List<Asistencia>();

            foreach (Inscripcion inscripcion
                     in inscripciones)
            {
                if (!clases.TryGetValue(
                        inscripcion.ClaseId,
                        out Clase? clase))
                {
                    continue;
                }

                // Las clases canceladas o suspendidas
                // no generan asistencia.
                if (clase.Estado ==
                        EstadoClase.Cancelada ||
                    clase.Estado ==
                        EstadoClase.Suspendida)
                {
                    continue;
                }

                var ocurrencias =
                    ObtenerOcurrenciasPasadas(
                        clase,
                        10);

                for (int indice = 0;
                     indice < ocurrencias.Count;
                     indice++)
                {
                    DateTime fechaClase =
                        ocurrencias[indice];

                    // La inscripción debe existir antes
                    // de la ocurrencia.
                    if (inscripcion.FechaInscripcion.Date >
                        fechaClase.Date)
                    {
                        continue;
                    }

                    int patron =
                        (
                            inscripcion.AlumnoId +
                            indice +
                            clase.Id
                        ) % 10;

                    bool presente;

                    // Algunos alumnos son muy constantes.
                    if (inscripcion.AlumnoId % 10 == 0)
                    {
                        presente =
                            patron != 0;
                    }

                    // Algunos alumnos faltan bastante.
                    else if (
                        inscripcion.AlumnoId % 7 == 0)
                    {
                        presente =
                            patron >= 5;
                    }

                    // Alumno promedio.
                    else
                    {
                        presente =
                            patron >= 2;
                    }

                    bool porGeolocalizacion =
                        presente &&
                        patron % 2 == 0;

                    decimal? latitud =
                        null;

                    decimal? longitud =
                        null;

                    decimal? distancia =
                        null;

                    if (porGeolocalizacion)
                    {
                        latitud =
                            clase.Ubicacion.Latitud +
                            0.000050m;

                        longitud =
                            clase.Ubicacion.Longitud +
                            0.000050m;

                        distancia =
                            10m +
                            (
                                (
                                    inscripcion.AlumnoId +
                                    indice
                                ) %
                                50
                            );
                    }

                    asistencias.Add(
                        new Asistencia
                        {
                            AlumnoId =
                                inscripcion.AlumnoId,

                            ClaseId =
                                clase.Id,

                            Fecha =
                                fechaClase.Date,

                            Presente =
                                presente,

                            FechaRegistro =
                                fechaClase.Date
                                    .Add(
                                        clase.HoraInicio)
                                    .AddMinutes(
                                        presente
                                            ? 5
                                            : 60),

                            RegistradoPorId =
                                porGeolocalizacion
                                    ? inscripcion.AlumnoId
                                    : adminId,

                            Latitud =
                                latitud,

                            Longitud =
                                longitud,

                            DistanciaMetros =
                                distancia,

                            RegistradaPorGeolocalizacion =
                                porGeolocalizacion
                        });
                }
            }

            _context.Asistencias.AddRange(
                asistencias);

            _context.SaveChanges();
        }

        private static List<DateTime> ObtenerOcurrenciasPasadas(
    Clase clase,
    int cantidadMaxima)
        {
            var resultado = new List<DateTime>();

            DateTime hoy = DateTime.Today;

            // CLASE PUNTUAL
            if (!clase.EsFija)
            {
                if (clase.FechaInicio.Date < hoy &&
                    clase.Estado != EstadoClase.Cancelada &&
                    clase.Estado != EstadoClase.Suspendida)
                {
                    resultado.Add(clase.FechaInicio.Date);
                }

                return resultado;
            }

            // CLASE RECURRENTE
            DateTime inicio = clase.FechaInicio.Date;
            DateTime limite = hoy.AddDays(-1);

            if (clase.FechaFin.HasValue &&
                clase.FechaFin.Value.Date < limite)
            {
                limite = clase.FechaFin.Value.Date;
            }

            if (limite < inicio)
            {
                return resultado;
            }

            DateTime fecha = limite;

            DayOfWeek diaObjetivo =
                ConvertirADayOfWeek(clase.DiaSemana);

            while (fecha.DayOfWeek != diaObjetivo)
            {
                fecha = fecha.AddDays(-1);
            }

            while (fecha >= inicio &&
                   resultado.Count < cantidadMaxima)
            {
                resultado.Add(fecha);
                fecha = fecha.AddDays(-7);
            }

            resultado.Reverse();

            return resultado;
        }

        // =====================================================
        // CONFIGURACIÓN CUOTA
        // =====================================================

        private void CrearConfiguracionCuota()
        {
            if (_context.ConfiguracionesCuota.Any())
            {
                return;
            }

            _context.ConfiguracionesCuota.Add(
                new ConfiguracionCuota
                {
                    MontoMensual =
                        2000m
                });

            _context.SaveChanges();
        }

        // =====================================================
        // CUOTAS
        // =====================================================

        private void CrearCuotas()
        {
            var alumnos =
                _context.Set<Alumno>()
                    .OrderBy(
                        a =>
                            a.UsuarioId)
                    .ToList();

            var cuotas =
                new List<Cuota>();

            DateTime hoy =
                DateTime.Today;

            // Generamos 4 meses de historial.
            for (int mesesAtras = 3;
                 mesesAtras >= 0;
                 mesesAtras--)
            {
                DateTime periodo =
                    hoy.AddMonths(
                        -mesesAtras);

                for (int indice = 0;
                     indice < alumnos.Count;
                     indice++)
                {
                    Alumno alumno =
                        alumnos[indice];

                    EstadoCuota estado;

                    DateTime vencimiento =
                        new DateTime(
                            periodo.Year,
                            periodo.Month,
                            10);

                    // Meses históricos:
                    // mayoría pagados.
                    if (mesesAtras > 0)
                    {
                        estado =
                            indice % 8 == 0
                                ? EstadoCuota.VENCIDA
                                : EstadoCuota.PAGADA;
                    }
                    else
                    {
                        if (indice % 5 == 0)
                        {
                            estado =
                                EstadoCuota.VENCIDA;
                        }
                        else if (
                            indice % 3 == 0)
                        {
                            estado =
                                EstadoCuota.PAGADA;
                        }
                        else
                        {
                            estado =
                                EstadoCuota.PENDIENTE;
                        }
                    }

                    decimal descuento =
                        indice % 10 == 0
                            ? 200m
                            : 0m;

                    cuotas.Add(
                        new Cuota
                        {
                            AlumnoId =
                                alumno.UsuarioId,

                            Mes =
                                periodo.Month,

                            Anio =
                                periodo.Year,

                            FechaVencimiento =
                                vencimiento,

                            MontoBase =
                                2000m,

                            Descuento =
                                descuento,

                            MontoFinal =
                                2000m -
                                descuento,

                            Estado =
                                estado
                        });
                }
            }

            _context.Cuotas.AddRange(
                cuotas);

            _context.SaveChanges();
        }

        // =====================================================
        // PAGOS
        // =====================================================

        private void CrearPagos()
        {
            var cuotasPagadas =
                _context.Cuotas
                    .Where(
                        c =>
                            c.Estado ==
                            EstadoCuota.PAGADA)
                    .OrderBy(
                        c =>
                            c.Id)
                    .ToList();

            var pagos =
                new List<Pago>();

            for (int indice = 0;
                 indice < cuotasPagadas.Count;
                 indice++)
            {
                Cuota cuota =
                    cuotasPagadas[indice];

                MedioPago medio =
    (indice % 3) switch
    {
        0 => MedioPago.EFECTIVO,
        1 => MedioPago.TRANSFERENCIA,
        _ => MedioPago.MERCADOPAGO
    };

                DateTime fechaPago =
                    new DateTime(
                        cuota.Anio,
                        cuota.Mes,
                        Math.Min(
                            8,
                            DateTime.DaysInMonth(
                                cuota.Anio,
                                cuota.Mes)));

                pagos.Add(
                    new Pago
                    {
                        CuotaId =
                            cuota.Id,

                        MedioPago =
                            medio,

                        FechaPago =
                            fechaPago,

                        Monto =
                            cuota.MontoFinal,

                        Estado =
                            EstadoPago.APROBADO,

                        ReferenciaExterna =
                            medio ==
                            MedioPago.MERCADOPAGO
                                ? $"MP-DEMO-{cuota.Id:0000}"
                                : $"DEMO-{cuota.Id:0000}"
                    });
            }

            _context.Pagos.AddRange(
                pagos);

            _context.SaveChanges();
        }

        // =====================================================
        // DESCUENTOS
        // =====================================================

        private void CrearDescuentos()
        {
            var descuentos =
                new List<Descuento>
                {
                    new Descuento
                    {
                        Nombre =
                            "10% por constancia",

                        Descripcion =
                            "Descuento del 10% durante un mes.",

                        Porcentaje =
                            10m,

                        MesesDuracion =
                            1,

                        Activo =
                            true
                    },

                    new Descuento
                    {
                        Nombre =
                            "20% desafío mensual",

                        Descripcion =
                            "Descuento del 20% durante dos meses.",

                        Porcentaje =
                            20m,

                        MesesDuracion =
                            2,

                        Activo =
                            true
                    },

                    new Descuento
                    {
                        Nombre =
                            "25% ganador destacado",

                        Descripcion =
                            "Descuento del 25% para ganadores destacados.",

                        Porcentaje =
                            25m,

                        MesesDuracion =
                            1,

                        Activo =
                            true
                    }
                };

            _context.Descuentos.AddRange(
                descuentos);

            _context.SaveChanges();
        }

        // =====================================================
        // DESAFÍOS
        // =====================================================

        private void CrearDesafios()
        {
            var desafios =
                new List<Desafio>
                {
                    new Desafio
                    {
                        Titulo =
                            "Desafío de asistencia mensual",

                        Descripcion =
                            "Completar al menos 12 clases durante el mes.",

                        FechaInicio =
                            DateTime.Today.AddDays(-10),

                        FechaFin =
                            DateTime.Today.AddDays(20),

                        Activo =
                            true
                    },

                    new Desafio
                    {
                        Titulo =
                            "Desafío 30 días",

                        Descripcion =
                            "Mantener constancia de entrenamiento durante 30 días.",

                        FechaInicio =
                            DateTime.Today.AddDays(-5),

                        FechaFin =
                            DateTime.Today.AddDays(25),

                        Activo =
                            true
                    },

                    new Desafio
                    {
                        Titulo =
                            "Desafío Invierno Finalizado",

                        Descripcion =
                            "Desafío histórico finalizado con ganadores.",

                        FechaInicio =
                            DateTime.Today.AddDays(-60),

                        FechaFin =
                            DateTime.Today.AddDays(-30),

                        Activo =
                            false
                    },

                    new Desafio
                    {
                        Titulo =
                            "Desafío Demo Sin Recompensa",

                        Descripcion =
                            "Preparado para crear una recompensa durante la demo.",

                        FechaInicio =
                            DateTime.Today,

                        FechaFin =
                            DateTime.Today.AddDays(30),

                        Activo =
                            true
                    }
                };

            _context.Desafios.AddRange(
                desafios);

            _context.SaveChanges();
        }

        // =====================================================
        // RECOMPENSAS
        // =====================================================

        private void CrearRecompensas()
        {
            var desafios =
                _context.Desafios
                    .ToList();

            var descuentos =
                _context.Descuentos
                    .OrderBy(
                        d =>
                            d.Id)
                    .ToList();

            var asistencia =
                desafios.First(
                    d =>
                        d.Titulo ==
                        "Desafío de asistencia mensual");

            var treintaDias =
                desafios.First(
                    d =>
                        d.Titulo ==
                        "Desafío 30 días");

            var finalizado =
                desafios.First(
                    d =>
                        d.Titulo ==
                        "Desafío Invierno Finalizado");

            var recompensas =
                new List<Recompensa>
                {
                    new Recompensa
                    {
                        Descripcion =
                            "20% de descuento para los ganadores.",

                        Tipo =
                            TipoRecompensa.DESCUENTO_CUOTA,

                        DesafioId =
                            asistencia.Id,

                        DescuentoId =
                            descuentos[1].Id,

                        Activo =
                            true
                    },

                    new Recompensa
                    {
                        Descripcion =
                            "Remera oficial Joki Training Team.",

                        Tipo =
                            TipoRecompensa.PRODUCTO_REGALO,

                        DesafioId =
                            treintaDias.Id,

                        PremioFisico =
                            "Remera oficial Joki",

                        Activo =
                            true
                    },

                    new Recompensa
                    {
                        Descripcion =
                            "Una cuota mensual gratis.",

                        Tipo =
                            TipoRecompensa.CUOTA_GRATIS,

                        DesafioId =
                            finalizado.Id,

                        OtorgaCuotaGratis =
                            true,

                        Activo =
                            true
                    },

                    new Recompensa
                    {
                        Descripcion =
                            "25% de descuento para el ganador histórico.",

                        Tipo =
                            TipoRecompensa.DESCUENTO_CUOTA,

                        DesafioId =
                            finalizado.Id,

                        DescuentoId =
                            descuentos[2].Id,

                        Activo =
                            true
                    }
                };

            _context.Recompensas.AddRange(
                recompensas);

            _context.SaveChanges();
        }

        // =====================================================
        // PARTICIPACIONES
        // =====================================================

        private void CrearParticipaciones()
        {
            var alumnos =
                _context.Set<Alumno>()
                    .OrderBy(
                        a =>
                            a.UsuarioId)
                    .Take(25)
                    .ToList();

            var desafios =
                _context.Desafios
                    .ToList();

            var participaciones =
                new List<ParticipacionDesafio>();

            foreach (Desafio desafio
                     in desafios)
            {
                int cantidad =
                    desafio.Titulo ==
                    "Desafío Demo Sin Recompensa"
                        ? 8
                        : 15;

                foreach (Alumno alumno
                         in alumnos.Take(cantidad))
                {
                    bool ganador =
                        desafio.Titulo ==
                        "Desafío Invierno Finalizado" &&
                        (
                            alumno.UsuarioId ==
                            alumnos[0].UsuarioId ||
                            alumno.UsuarioId ==
                            alumnos[1].UsuarioId
                        );

                    participaciones.Add(
                        new ParticipacionDesafio
                        {
                            AlumnoId =
                                alumno.UsuarioId,

                            DesafioId =
                                desafio.Id,

                            Resultado =
                                ganador
                                    ? "Ganador asignado"
                                    : desafio.Activo
                                        ? "Participando"
                                        : "Finalizado",

                            Ganador =
                                ganador
                        });
                }
            }

            _context.ParticipacionesDesafio.AddRange(
                participaciones);

            _context.SaveChanges();
        }

        // =====================================================
        // BENEFICIOS
        // =====================================================

        private void CrearBeneficios()
        {
            var alumnos =
                _context.Set<Alumno>()
                    .OrderBy(
                        a =>
                            a.UsuarioId)
                    .Take(8)
                    .ToList();

            var recompensas =
                _context.Recompensas
                    .Include(
                        r =>
                            r.Descuento)
                    .OrderBy(
                        r =>
                            r.Id)
                    .ToList();

            var beneficios =
                new List<Beneficio>
                {
                    new Beneficio
                    {
                        AlumnoId =
                            alumnos[0].UsuarioId,

                        RecompensaId =
                            recompensas[0].Id,

                        DescuentoId =
                            recompensas[0].DescuentoId,

                        Estado =
                            EstadoBeneficio.PENDIENTE,

                        DescripcionBeneficio =
                            recompensas[0].Descripcion,

                        MesesDuracion =
                            recompensas[0]
                                .Descuento?
                                .MesesDuracion ?? 1,

                        FechaAsignacion =
                            DateTime.UtcNow
                                .AddDays(-2)
                    },

                    new Beneficio
                    {
                        AlumnoId =
                            alumnos[1].UsuarioId,

                        RecompensaId =
                            recompensas[1].Id,

                        Estado =
                            EstadoBeneficio.PENDIENTE,

                        DescripcionBeneficio =
                            recompensas[1].Descripcion,

                        FechaAsignacion =
                            DateTime.UtcNow
                                .AddDays(-1)
                    },

                    new Beneficio
                    {
                        AlumnoId =
                            alumnos[2].UsuarioId,

                        RecompensaId =
                            recompensas[2].Id,

                        CuotaGratis =
                            true,

                        Estado =
                            EstadoBeneficio.OTORGADO,

                        DescripcionBeneficio =
                            recompensas[2].Descripcion,

                        MesesAplicados =
                            1,

                        FechaAsignacion =
                            DateTime.UtcNow
                                .AddDays(-20)
                    },

                    new Beneficio
                    {
                        AlumnoId =
                            alumnos[3].UsuarioId,

                        RecompensaId =
                            recompensas[3].Id,

                        DescuentoId =
                            recompensas[3].DescuentoId,

                        Estado =
                            EstadoBeneficio.OTORGADO,

                        DescripcionBeneficio =
                            recompensas[3].Descripcion,

                        MesesDuracion =
                            recompensas[3]
                                .Descuento?
                                .MesesDuracion ?? 1,

                        MesesAplicados =
                            1,

                        FechaAsignacion =
                            DateTime.UtcNow
                                .AddDays(-15)
                    }
                };

            _context.Beneficios.AddRange(
                beneficios);

            _context.SaveChanges();
        }

        // =====================================================
        // NOTIFICACIONES
        // =====================================================

        private void CrearNotificaciones()
        {
            var alumnos =
                _context.Set<Alumno>()
                    .OrderBy(
                        a =>
                            a.UsuarioId)
                    .Take(10)
                    .ToList();

            int adminId =
                ObtenerAdministradorId();

            var notificaciones =
                new List<Notificacion>
                {
                    CrearNotificacion(
                        alumnos[0].UsuarioId,
                        "Próxima clase",
                        "Tu próxima clase comienza hoy.",
                        TipoNotificacion.ProximaClase,
                        "/clases",
                        false,
                        DateTime.UtcNow.AddHours(-1)),

                    CrearNotificacion(
                        alumnos[0].UsuarioId,
                        "Nuevo desafío",
                        "Ya podés participar en el nuevo desafío mensual.",
                        TipoNotificacion.Desafio,
                        "/desafios",
                        false,
                        DateTime.UtcNow.AddDays(-1)),

                    CrearNotificacion(
                        alumnos[1].UsuarioId,
                        "Cuota por vencer",
                        "Tu cuota vence en los próximos días.",
                        TipoNotificacion.Vencimiento,
                        "/cuotas",
                        false,
                        DateTime.UtcNow.AddDays(-2)),

                    CrearNotificacion(
                        alumnos[2].UsuarioId,
                        "Cuota vencida",
                        "Tu cuota se encuentra vencida.",
                        TipoNotificacion.Deuda,
                        "/cuotas",
                        false,
                        DateTime.UtcNow.AddDays(-3)),

                    CrearNotificacion(
                        alumnos[3].UsuarioId,
                        "Nuevo desafío disponible",
                        "Ya podés participar en el desafío mensual.",
                        TipoNotificacion.Desafio,
                        "/desafios",
                        true,
                        DateTime.UtcNow.AddDays(-5)),

                    CrearNotificacion(
                        alumnos[4].UsuarioId,
                        "Nuevo beneficio",
                        "Recibiste un beneficio por tu constancia.",
                        TipoNotificacion.Beneficio,
                        "/beneficios",
                        false,
                        DateTime.UtcNow.AddHours(-5)),

                    CrearNotificacion(
                        adminId,
                        "Premio físico pendiente",
                        "Hay un premio físico pendiente de entrega.",
                        TipoNotificacion.Beneficio,
                        "/admin/beneficios",
                        false,
                        DateTime.UtcNow.AddHours(-3)),

                    CrearNotificacion(
                        adminId,
                        "Cuotas vencidas",
                        "Existen alumnos con cuotas vencidas pendientes de regularización.",
                        TipoNotificacion.Deuda,
                        "/admin/cuotas",
                        false,
                        DateTime.UtcNow.AddDays(-1)),

                    CrearNotificacion(
                        adminId,
                        "Sistema listo para demo",
                        "El entorno demo fue generado correctamente.",
                        TipoNotificacion.Sistema,
                        "/admin",
                        true,
                        DateTime.UtcNow.AddDays(-7))
                };

            _context.Notificaciones.AddRange(
                notificaciones);

            _context.SaveChanges();
        }

        private static Notificacion CrearNotificacion(
            int usuarioId,
            string titulo,
            string mensaje,
            TipoNotificacion tipo,
            string url,
            bool leida,
            DateTime fecha)
        {
            return new Notificacion
            {
                UsuarioId =
                    usuarioId,

                Titulo =
                    titulo,

                Mensaje =
                    mensaje,

                Tipo =
                    tipo,

                Leida =
                    leida,

                FechaCreacion =
                    fecha,

                UrlDestino =
                    url
            };
        }

        // =====================================================
        // HELPERS
        // =====================================================

        private static DiaSemana ConvertirDiaSemana(
            DayOfWeek dia)
        {
            return dia switch
            {
                DayOfWeek.Monday =>
                    DiaSemana.Lunes,

                DayOfWeek.Tuesday =>
                    DiaSemana.Martes,

                DayOfWeek.Wednesday =>
                    DiaSemana.Miercoles,

                DayOfWeek.Thursday =>
                    DiaSemana.Jueves,

                DayOfWeek.Friday =>
                    DiaSemana.Viernes,

                DayOfWeek.Saturday =>
                    DiaSemana.Sabado,

                DayOfWeek.Sunday =>
                    DiaSemana.Domingo,

                _ =>
                    DiaSemana.Lunes
            };
        }

        private static DayOfWeek ConvertirADayOfWeek(
            DiaSemana dia)
        {
            return dia switch
            {
                DiaSemana.Lunes =>
                    DayOfWeek.Monday,

                DiaSemana.Martes =>
                    DayOfWeek.Tuesday,

                DiaSemana.Miercoles =>
                    DayOfWeek.Wednesday,

                DiaSemana.Jueves =>
                    DayOfWeek.Thursday,

                DiaSemana.Viernes =>
                    DayOfWeek.Friday,

                DiaSemana.Sabado =>
                    DayOfWeek.Saturday,

                DiaSemana.Domingo =>
                    DayOfWeek.Sunday,

                _ =>
                    DayOfWeek.Monday
            };
        }

        private int ObtenerAdministradorId()
        {
            return _context.Set<Entrenador>()
                .AsEnumerable()
                .First(
                    e =>
                        e.Email.Valor.Equals(
                            "admin@demo.joki.com",
                            StringComparison.OrdinalIgnoreCase))
                .UsuarioId;
        }
    }
}