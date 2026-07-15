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

        private void CrearRolesSiNoExisten()
        {
            if (!_context.Roles.Any(r => r.Nombre == "Admin"))
                _context.Roles.Add(new Rol { Nombre = "Admin" });

            if (!_context.Roles.Any(r => r.Nombre == "Entrenador"))
                _context.Roles.Add(new Rol { Nombre = "Entrenador" });

            if (!_context.Roles.Any(r => r.Nombre == "Alumno"))
                _context.Roles.Add(new Rol { Nombre = "Alumno" });

            _context.SaveChanges();
        }

        private void CrearUsuarios()
        {
            var rolAdmin = _context.Roles.First(r => r.Nombre == "Admin");
            var rolEntrenador = _context.Roles.First(r => r.Nombre == "Entrenador");
            var rolAlumno = _context.Roles.First(r => r.Nombre == "Alumno");

            var usuarios = new List<Usuario>
            {
                CrearEntrenador("Administrador", "Joki",
                    "admin@demo.joki.com", "098000001",
                    rolAdmin.Id, Genero.MASCULINO),

                CrearEntrenador("Juan", "Rodriguez",
                    "juan.entrenador@demo.joki.com", "098000002",
                    rolEntrenador.Id, Genero.MASCULINO),

                CrearEntrenador("Maria", "Fernandez",
                    "maria.entrenadora@demo.joki.com", "098000003",
                    rolEntrenador.Id, Genero.FEMENINO),

                CrearEntrenador("Diego", "Silva",
                    "diego.entrenador@demo.joki.com", "098000004",
                    rolEntrenador.Id, Genero.MASCULINO),

                CrearEntrenador("Carla", "Suarez",
                    "carla.entrenadora@demo.joki.com", "098000005",
                    rolEntrenador.Id, Genero.FEMENINO)
            };

            usuarios.Add(CrearAlumno(
                "Alumno", "Demo", "demo.alumno@joki.com",
                "097100001", rolAlumno.Id, Genero.MASCULINO, 1));

            usuarios.Add(CrearAlumno(
                "Passwordless", "Demo", "demo.passwordless@joki.com",
                "097100002", rolAlumno.Id, Genero.FEMENINO, 2));

            var alumno2FA = CrearAlumno(
                "Autenticador", "Demo", "demo.2fa@joki.com",
                "097100003", rolAlumno.Id, Genero.MASCULINO, 3);

            alumno2FA.TwoFactorEnabled = true;
            alumno2FA.TwoFactorSecret =
                "M3JBVZ3C3UH7K3QGODB5ES3H7VGMHXAV";

            usuarios.Add(alumno2FA);

            for (int numero = 4; numero <= 50; numero++)
            {
                string texto = numero.ToString("00");
                Genero genero = numero % 2 == 0
                    ? Genero.FEMENINO
                    : Genero.MASCULINO;

                usuarios.Add(CrearAlumno(
                    $"Alumno{texto}",
                    "Demo",
                    $"alumno{texto}@demo.joki.com",
                    $"09710{numero:0000}",
                    rolAlumno.Id,
                    genero,
                    numero));
            }

            _context.Usuarios.AddRange(usuarios);
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
                Nombre = new Nombre(nombre),
                Apellido = new Apellido(apellido),
                Email = new Email(email),
                Contrasena = CrearContrasenaDemo(),
                ProveedorAutenticacion = "LOCAL",
                Estado = EstadoUsuario.ACTIVO,
                RolId = rolId,
                Genero = genero,
                FechaNacimiento = new DateTime(1990, 1, 15),
                Celular = Celular.Crear(celular),
                SociedadMedica = "CASMU",
                TwoFactorEnabled = false
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
            decimal peso = 55m + indice % 35;
            decimal estatura = 1.55m + ((indice % 30) / 100m);

            return new Alumno
            {
                Nombre = new Nombre(nombre),
                Apellido = new Apellido(apellido),
                Email = new Email(email),
                Contrasena = CrearContrasenaDemo(),
                ProveedorAutenticacion = "LOCAL",
                Estado = EstadoUsuario.ACTIVO,
                RolId = rolId,
                Genero = genero,
                FechaNacimiento = new DateTime(
                    1990 + indice % 14,
                    indice % 12 + 1,
                    indice % 25 + 1),
                Celular = Celular.Crear(celular),
                SociedadMedica = ObtenerSociedadMedica(indice),
                Peso = peso,
                Estatura = estatura,
                IMC = Math.Round(peso / (estatura * estatura), 2),
                BloqueadoPorInasistencias = indice % 17 == 0,
                RachaAsistenciaMensual = indice % 11,
                MesRachaAsistencia = DateTime.Now.Month,
                AnioRachaAsistencia = DateTime.Now.Year,
                DescuentoRachaGenerado = indice % 10 == 0,
                TwoFactorEnabled = false
            };
        }

        private Contrasena CrearContrasenaDemo()
        {
            string hash = _hasheador.HashPassword(null!, PasswordDemo);
            return Contrasena.FromHash(hash);
        }

        private static string ObtenerSociedadMedica(int indice)
        {
            string[] sociedades = { "ASSE", "CASMU", "MP", "SMI", "MUCAM" };
            return sociedades[indice % sociedades.Length];
        }

        private void CrearGrupos()
        {
            var entrenadores = _context.Set<Entrenador>()
                .Where(e => e.Rol.Nombre == "Entrenador")
                .OrderBy(e => e.UsuarioId)
                .ToList();

            if (entrenadores.Count < 4)
                throw new InvalidOperationException(
                    "No se encontraron los cuatro entrenadores demo.");

            var grupos = new List<Grupo>
            {
                CrearGrupo("Funcional Mañana", "Inicial", entrenadores[0].UsuarioId),
                CrearGrupo("Funcional Intermedio", "Intermedio", entrenadores[0].UsuarioId),
                CrearGrupo("Funcional Tarde", "Intermedio", entrenadores[1].UsuarioId),
                CrearGrupo("Funcional Avanzado", "Avanzado", entrenadores[1].UsuarioId),
                CrearGrupo("HIIT", "Intermedio", entrenadores[2].UsuarioId),
                CrearGrupo("Cross Training", "Avanzado", entrenadores[2].UsuarioId),
                CrearGrupo("Running", "Inicial", entrenadores[3].UsuarioId),
                CrearGrupo("Grupo Demo Sin Clases", "Inicial", entrenadores[3].UsuarioId)
            };

            _context.Grupos.AddRange(grupos);
            _context.SaveChanges();
        }

        private static Grupo CrearGrupo(
            string nombre,
            string nivel,
            int entrenadorId)
        {
            return new Grupo
            {
                Nombre = nombre,
                Nivel = nivel,
                Estado = EstadoGrupo.ACTIVO,
                EntrenadorId = entrenadorId
            };
        }

        private void CrearClases()
        {
            var grupos = _context.Grupos
                .Where(g => g.Nombre != "Grupo Demo Sin Clases")
                .OrderBy(g => g.Id)
                .ToList();

            var clases = new List<Clase>();

            for (int indice = 0; indice < grupos.Count; indice++)
            {
                int horaBase = indice % 2 == 0 ? 8 : 18;

                clases.Add(CrearClase(
                    grupos[indice].Id, DiaSemana.Lunes, horaBase, indice));

                clases.Add(CrearClase(
                    grupos[indice].Id, DiaSemana.Miercoles, horaBase, indice));

                clases.Add(CrearClase(
                    grupos[indice].Id, DiaSemana.Viernes, horaBase, indice));
            }

            clases.Add(new Clase
            {
                GrupoId = grupos.First().Id,
                DiaSemana = ConvertirDiaSemana(DateTime.Today.DayOfWeek),
                HoraInicio = DateTime.Now.TimeOfDay.Subtract(
                    TimeSpan.FromMinutes(10)),
                HoraFin = DateTime.Now.TimeOfDay.Add(
                    TimeSpan.FromMinutes(50)),
                Ubicacion = new Ubicacion
                {
                    Latitud = -34.900000m,
                    Longitud = -56.160000m,
                    CodigoPostal = "11000"
                },
                RadioGeolocalizacion = 500m,
                EsFija = true,
                FechaInicio = DateTime.Today.AddMonths(-1),
                FechaFin = DateTime.Today.AddMonths(3),
                CupoMaximo = 20,
                Estado = EstadoClase.Programada
            });

            _context.Clases.AddRange(clases);
            _context.SaveChanges();
        }

        private static Clase CrearClase(
            int grupoId,
            DiaSemana dia,
            int horaInicio,
            int indiceGrupo)
        {
            return new Clase
            {
                GrupoId = grupoId,
                DiaSemana = dia,
                HoraInicio = new TimeSpan(horaInicio, 0, 0),
                HoraFin = new TimeSpan(horaInicio + 1, 0, 0),
                Ubicacion = new Ubicacion
                {
                    Latitud = -34.900000m + indiceGrupo * 0.001000m,
                    Longitud = -56.160000m + indiceGrupo * 0.001000m,
                    CodigoPostal = "11000"
                },
                RadioGeolocalizacion = 150m,
                EsFija = true,
                FechaInicio = DateTime.Today.AddMonths(-2),
                FechaFin = DateTime.Today.AddMonths(4),
                CupoMaximo = 20,
                Estado = EstadoClase.Programada
            };
        }

        private static DiaSemana ConvertirDiaSemana(DayOfWeek dia)
        {
            return dia switch
            {
                DayOfWeek.Monday => DiaSemana.Lunes,
                DayOfWeek.Tuesday => DiaSemana.Martes,
                DayOfWeek.Wednesday => DiaSemana.Miercoles,
                DayOfWeek.Thursday => DiaSemana.Jueves,
                DayOfWeek.Friday => DiaSemana.Viernes,
                DayOfWeek.Saturday => DiaSemana.Sabado,
                DayOfWeek.Sunday => DiaSemana.Domingo,
                _ => DiaSemana.Lunes
            };
        }

        private void CrearInscripciones()
        {
            var alumnos = _context.Set<Alumno>()
                .OrderBy(a => a.UsuarioId)
                .ToList();

            var clases = _context.Clases
                .OrderBy(c => c.Id)
                .ToList();

            var inscripciones = new List<Inscripcion>();

            for (int indice = 0; indice < alumnos.Count; indice++)
            {
                var principal = clases[indice % clases.Count];

                inscripciones.Add(new Inscripcion
                {
                    AlumnoId = alumnos[indice].UsuarioId,
                    ClaseId = principal.Id,
                    FechaInscripcion =
                        DateTime.Today.AddDays(-(indice % 60))
                });

                if (indice % 3 == 0)
                {
                    var secundaria = clases[(indice + 5) % clases.Count];

                    if (secundaria.Id != principal.Id)
                    {
                        inscripciones.Add(new Inscripcion
                        {
                            AlumnoId = alumnos[indice].UsuarioId,
                            ClaseId = secundaria.Id,
                            FechaInscripcion =
                                DateTime.Today.AddDays(-(indice % 30))
                        });
                    }
                }
            }

            var alumnoDemo = alumnos.First(a =>
                a.Email.Valor == "demo.alumno@joki.com");

            var claseGeo = clases.Last();

            if (!inscripciones.Any(i =>
                i.AlumnoId == alumnoDemo.UsuarioId &&
                i.ClaseId == claseGeo.Id))
            {
                inscripciones.Add(new Inscripcion
                {
                    AlumnoId = alumnoDemo.UsuarioId,
                    ClaseId = claseGeo.Id,
                    FechaInscripcion = DateTime.Today
                });
            }

            _context.Inscripciones.AddRange(inscripciones);
            _context.SaveChanges();
        }

        private void CrearAsistencias()
        {
            var inscripciones = _context.Inscripciones
                .OrderBy(i => i.Id)
                .Take(60)
                .ToList();

            var asistencias = new List<Asistencia>();
            int adminId = ObtenerAdministradorId();

            foreach (var inscripcion in inscripciones)
            {
                for (int semana = 1; semana <= 4; semana++)
                {
                    bool presente =
                        (inscripcion.AlumnoId + semana) % 5 != 0;

                    bool geo =
                        presente &&
                        (inscripcion.AlumnoId + semana) % 3 == 0;

                    DateTime fecha =
                        DateTime.Today.AddDays(-(semana * 7));

                    asistencias.Add(new Asistencia
                    {
                        AlumnoId = inscripcion.AlumnoId,
                        ClaseId = inscripcion.ClaseId,
                        Fecha = fecha.Date,
                        Presente = presente,
                        FechaRegistro = fecha.AddHours(18),
                        RegistradoPorId =
                            geo ? inscripcion.AlumnoId : adminId,
                        Latitud = geo ? -34.900000m : null,
                        Longitud = geo ? -56.160000m : null,
                        DistanciaMetros =
                            geo ? 15m + inscripcion.AlumnoId % 40 : null,
                        RegistradaPorGeolocalizacion = geo
                    });
                }
            }

            _context.Asistencias.AddRange(asistencias);
            _context.SaveChanges();
        }


        // =====================================================
        // CONFIGURACIÓN DE CUOTA
        // =====================================================

        private void CrearConfiguracionCuota()
        {
            if (_context.ConfiguracionesCuota.Any())
            {
                return;
            }

            var configuracion = new ConfiguracionCuota
            {
                MontoMensual = 2000m
            };

            _context.ConfiguracionesCuota.Add(configuracion);

            _context.SaveChanges();
        }

        private void CrearCuotas()
        {
            var alumnos = _context.Set<Alumno>()
                .OrderBy(a => a.UsuarioId)
                .ToList();

            var cuotas = new List<Cuota>();
            DateTime hoy = DateTime.Today;

            for (int indice = 0; indice < alumnos.Count; indice++)
            {
                EstadoCuota estado;
                DateTime vencimiento;

                if (indice % 5 == 0)
                {
                    estado = EstadoCuota.VENCIDA;
                    vencimiento = hoy.AddDays(-10);
                }
                else if (indice % 3 == 0)
                {
                    estado = EstadoCuota.PAGADA;
                    vencimiento = hoy.AddDays(10);
                }
                else
                {
                    estado = EstadoCuota.PENDIENTE;
                    vencimiento = hoy.AddDays(10);
                }

                decimal descuento = indice % 10 == 0 ? 200m : 0m;

                cuotas.Add(new Cuota
                {
                    AlumnoId = alumnos[indice].UsuarioId,
                    Mes = hoy.Month,
                    Anio = hoy.Year,
                    FechaVencimiento = vencimiento,
                    MontoBase = 2000m,
                    Descuento = descuento,
                    MontoFinal = 2000m - descuento,
                    Estado = estado
                });
            }

            _context.Cuotas.AddRange(cuotas);
            _context.SaveChanges();
        }

        private void CrearPagos()
        {
            var cuotasPagadas =
                _context.Cuotas
                    .Where(c => c.Estado == EstadoCuota.PAGADA)
                    .OrderBy(c => c.Id)
                    .ToList();

            var pagos = new List<Pago>();

            for (int indice = 0; indice < cuotasPagadas.Count; indice++)
            {
                var cuota = cuotasPagadas[indice];

                MedioPago medio;

                switch (indice % 3)
                {
                    case 0:
                        medio = MedioPago.EFECTIVO;
                        break;

                    case 1:
                        medio = MedioPago.TRANSFERENCIA;
                        break;

                    default:
                        medio = MedioPago.MERCADOPAGO;
                        break;
                }

                pagos.Add(
                    new Pago
                    {
                        CuotaId = cuota.Id,
                        MedioPago = medio,
                        FechaPago = DateTime.UtcNow.AddDays(-(indice % 20)),
                        Monto = cuota.MontoFinal,
                        Estado = EstadoPago.APROBADO,
                        ReferenciaExterna =
                            medio == MedioPago.MERCADOPAGO
                                ? $"MP-DEMO-{cuota.Id:0000}"
                                : $"DEMO-{cuota.Id:0000}"
                    });
            }

            _context.Pagos.AddRange(pagos);
            _context.SaveChanges();
        }

        private void CrearDescuentos()
        {
            var descuentos = new List<Descuento>
            {
                new Descuento
                {
                    Nombre = "10% por constancia",
                    Descripcion = "Descuento del 10% durante un mes.",
                    Porcentaje = 10m,
                    MesesDuracion = 1,
                    Activo = true
                },
                new Descuento
                {
                    Nombre = "20% desafío mensual",
                    Descripcion = "Descuento del 20% durante dos meses.",
                    Porcentaje = 20m,
                    MesesDuracion = 2,
                    Activo = true
                },
                new Descuento
                {
                    Nombre = "25% ganador destacado",
                    Descripcion =
                        "Descuento del 25% para ganadores destacados.",
                    Porcentaje = 25m,
                    MesesDuracion = 1,
                    Activo = true
                }
            };

            _context.Descuentos.AddRange(descuentos);
            _context.SaveChanges();
        }

        private void CrearDesafios()
        {
            var desafios = new List<Desafio>
            {
                new Desafio
                {
                    Titulo = "Desafío de asistencia mensual",
                    Descripcion =
                        "Completar al menos 12 clases durante el mes.",
                    FechaInicio = DateTime.Today.AddDays(-10),
                    FechaFin = DateTime.Today.AddDays(20),
                    Activo = true
                },
                new Desafio
                {
                    Titulo = "Desafío 30 días",
                    Descripcion =
                        "Mantener constancia de entrenamiento durante 30 días.",
                    FechaInicio = DateTime.Today.AddDays(-5),
                    FechaFin = DateTime.Today.AddDays(25),
                    Activo = true
                },
                new Desafio
                {
                    Titulo = "Desafío Invierno Finalizado",
                    Descripcion =
                        "Desafío histórico finalizado con ganadores.",
                    FechaInicio = DateTime.Today.AddDays(-60),
                    FechaFin = DateTime.Today.AddDays(-30),
                    Activo = false
                },
                new Desafio
                {
                    Titulo = "Desafío Demo Sin Recompensa",
                    Descripcion =
                        "Preparado para crear una recompensa durante la demo.",
                    FechaInicio = DateTime.Today,
                    FechaFin = DateTime.Today.AddDays(30),
                    Activo = true
                }
            };

            _context.Desafios.AddRange(desafios);
            _context.SaveChanges();
        }

        private void CrearRecompensas()
        {
            var desafios = _context.Desafios.ToList();
            var descuentos = _context.Descuentos
                .OrderBy(d => d.Id)
                .ToList();

            var asistencia = desafios.First(d =>
                d.Titulo == "Desafío de asistencia mensual");

            var treintaDias = desafios.First(d =>
                d.Titulo == "Desafío 30 días");

            var finalizado = desafios.First(d =>
                d.Titulo == "Desafío Invierno Finalizado");

            var recompensas = new List<Recompensa>
            {
                new Recompensa
                {
                    Descripcion =
                        "20% de descuento para los ganadores.",
                    Tipo = TipoRecompensa.DESCUENTO_CUOTA,
                    DesafioId = asistencia.Id,
                    DescuentoId = descuentos[1].Id,
                    Activo = true
                },
                new Recompensa
                {
                    Descripcion =
                        "Remera oficial Joki Training Team.",
                    Tipo = TipoRecompensa.PRODUCTO_REGALO,
                    DesafioId = treintaDias.Id,
                    PremioFisico = "Remera oficial Joki",
                    Activo = true
                },
                new Recompensa
                {
                    Descripcion = "Una cuota mensual gratis.",
                    Tipo = TipoRecompensa.CUOTA_GRATIS,
                    DesafioId = finalizado.Id,
                    OtorgaCuotaGratis = true,
                    Activo = true
                },
                new Recompensa
                {
                    Descripcion =
                        "25% de descuento para el ganador histórico.",
                    Tipo = TipoRecompensa.DESCUENTO_CUOTA,
                    DesafioId = finalizado.Id,
                    DescuentoId = descuentos[2].Id,
                    Activo = true
                }
            };

            _context.Recompensas.AddRange(recompensas);
            _context.SaveChanges();
        }

        private void CrearParticipaciones()
        {
            var alumnos = _context.Set<Alumno>()
                .OrderBy(a => a.UsuarioId)
                .Take(20)
                .ToList();

            var desafios = _context.Desafios.ToList();
            var participaciones = new List<ParticipacionDesafio>();

            foreach (var desafio in desafios)
            {
                int cantidad =
                    desafio.Titulo == "Desafío Demo Sin Recompensa"
                        ? 8
                        : 12;

                foreach (var alumno in alumnos.Take(cantidad))
                {
                    bool ganador =
                        desafio.Titulo == "Desafío Invierno Finalizado" &&
                        alumno.UsuarioId == alumnos[0].UsuarioId;

                    participaciones.Add(new ParticipacionDesafio
                    {
                        AlumnoId = alumno.UsuarioId,
                        DesafioId = desafio.Id,
                        Resultado =
                            ganador ? "Ganador asignado" : "Participando",
                        Ganador = ganador
                    });
                }
            }

            _context.ParticipacionesDesafio.AddRange(participaciones);
            _context.SaveChanges();
        }

        private void CrearBeneficios()
        {
            var alumnos = _context.Set<Alumno>()
                .OrderBy(a => a.UsuarioId)
                .Take(8)
                .ToList();

            var recompensas = _context.Recompensas
                .Include(r => r.Descuento)
                .OrderBy(r => r.Id)
                .ToList();

            var beneficios = new List<Beneficio>
            {
                new Beneficio
                {
                    AlumnoId = alumnos[0].UsuarioId,
                    RecompensaId = recompensas[0].Id,
                    DescuentoId = recompensas[0].DescuentoId,
                    Estado = EstadoBeneficio.PENDIENTE,
                    DescripcionBeneficio =
                        recompensas[0].Descripcion,
                    MesesDuracion =
                        recompensas[0].Descuento?.MesesDuracion ?? 1,
                    FechaAsignacion =
                        DateTime.UtcNow.AddDays(-2)
                },
                new Beneficio
                {
                    AlumnoId = alumnos[1].UsuarioId,
                    RecompensaId = recompensas[1].Id,
                    Estado = EstadoBeneficio.PENDIENTE,
                    DescripcionBeneficio =
                        recompensas[1].Descripcion,
                    FechaAsignacion =
                        DateTime.UtcNow.AddDays(-1)
                },
                new Beneficio
                {
                    AlumnoId = alumnos[2].UsuarioId,
                    RecompensaId = recompensas[2].Id,
                    CuotaGratis = true,
                    Estado = EstadoBeneficio.OTORGADO,
                    DescripcionBeneficio =
                        recompensas[2].Descripcion,
                    MesesAplicados = 1,
                    FechaAsignacion =
                        DateTime.UtcNow.AddDays(-20)
                },
                new Beneficio
                {
                    AlumnoId = alumnos[3].UsuarioId,
                    RecompensaId = recompensas[3].Id,
                    DescuentoId = recompensas[3].DescuentoId,
                    Estado = EstadoBeneficio.OTORGADO,
                    DescripcionBeneficio =
                        recompensas[3].Descripcion,
                    MesesDuracion =
                        recompensas[3].Descuento?.MesesDuracion ?? 1,
                    MesesAplicados = 1,
                    FechaAsignacion =
                        DateTime.UtcNow.AddDays(-15)
                }
            };

            _context.Beneficios.AddRange(beneficios);
            _context.SaveChanges();
        }

        private void CrearNotificaciones()
        {
            var alumnos = _context.Set<Alumno>()
                .OrderBy(a => a.UsuarioId)
                .Take(10)
                .ToList();

            int adminId = ObtenerAdministradorId();

            var notificaciones = new List<Notificacion>
            {
                CrearNotificacion(
                    alumnos[0].UsuarioId,
                    "Próxima clase",
                    "Tu próxima clase comienza hoy.",
                    TipoNotificacion.ProximaClase,
                    "/clases"),

                CrearNotificacion(
                    alumnos[1].UsuarioId,
                    "Cuota por vencer",
                    "Tu cuota vence en los próximos días.",
                    TipoNotificacion.Vencimiento,
                    "/cuotas"),

                CrearNotificacion(
                    alumnos[2].UsuarioId,
                    "Cuota vencida",
                    "Tu cuota se encuentra vencida.",
                    TipoNotificacion.Deuda,
                    "/cuotas"),

                CrearNotificacion(
                    alumnos[3].UsuarioId,
                    "Nuevo desafío disponible",
                    "Ya podés participar en el desafío mensual.",
                    TipoNotificacion.Desafio,
                    "/desafios"),

                CrearNotificacion(
                    alumnos[4].UsuarioId,
                    "Nuevo beneficio",
                    "Recibiste un beneficio por tu constancia.",
                    TipoNotificacion.Beneficio,
                    "/beneficios"),

                CrearNotificacion(
                    adminId,
                    "Premio físico pendiente",
                    "Hay un premio físico pendiente de entrega.",
                    TipoNotificacion.Beneficio,
                    "/admin/beneficios"),

                CrearNotificacion(
                    adminId,
                    "Sistema listo para demo",
                    "El entorno demo fue generado correctamente.",
                    TipoNotificacion.Sistema,
                    "/admin")
            };

            _context.Notificaciones.AddRange(notificaciones);
            _context.SaveChanges();
        }

        private static Notificacion CrearNotificacion(
            int usuarioId,
            string titulo,
            string mensaje,
            TipoNotificacion tipo,
            string url)
        {
            return new Notificacion
            {
                UsuarioId = usuarioId,
                Titulo = titulo,
                Mensaje = mensaje,
                Tipo = tipo,
                Leida = false,
                FechaCreacion = DateTime.UtcNow,
                UrlDestino = url
            };
        }

        private int ObtenerAdministradorId()
        {
            return _context.Set<Entrenador>()
                .AsEnumerable()
                .First(e => e.Email.Valor.Equals(
                    "admin@demo.joki.com",
                    StringComparison.OrdinalIgnoreCase))
                .UsuarioId;
        }
    }
}