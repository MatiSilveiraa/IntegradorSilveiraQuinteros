using Hangfire;
using Joki.CasoUsoCompartida.Configuracion;
using Joki.CasoUsoCompartida.InterfacesCasosUso.Admin;
using Joki.CasoUsoCompartida.InterfacesCasosUso.Alumno;
using Joki.CasoUsoCompartida.InterfacesCasosUso.Asistencia;
using Joki.CasoUsoCompartida.InterfacesCasosUso.Auditoria;
using Joki.CasoUsoCompartida.InterfacesCasosUso.Autenticacion;
using Joki.CasoUsoCompartida.InterfacesCasosUso.Beneficio;
using Joki.CasoUsoCompartida.InterfacesCasosUso.Clase;
using Joki.CasoUsoCompartida.InterfacesCasosUso.ConfiguracionCuota;
using Joki.CasoUsoCompartida.InterfacesCasosUso.Cuota;
using Joki.CasoUsoCompartida.InterfacesCasosUso.Desafio;
using Joki.CasoUsoCompartida.InterfacesCasosUso.Descuento;
using Joki.CasoUsoCompartida.InterfacesCasosUso.Grupo;
using Joki.CasoUsoCompartida.InterfacesCasosUso.Historial;
using Joki.CasoUsoCompartida.InterfacesCasosUso.Notificacion;
using Joki.CasoUsoCompartida.InterfacesCasosUso.Pago;
using Joki.CasoUsoCompartida.InterfacesCasosUso.Perfil;
using Joki.CasoUsoCompartida.InterfacesCasosUso.Reactivacion;
using Joki.CasoUsoCompartida.InterfacesCasosUso.Recompensa;
using Joki.Infraestructura.AccesoDatos.EF;
using Joki.Infraestructura.AccesoDatos.EF.Repositorios;
using Joki.Infraestructura.AccesoDatos.Repositorios;
using Joki.Infraestructura.Servicios;
using Joki.LogicaAplicacion.CasosDeUso.Admin;
using Joki.LogicaAplicacion.CasosDeUso.Alumno;
using Joki.LogicaAplicacion.CasosDeUso.Alumnos;
using Joki.LogicaAplicacion.CasosDeUso.Asistencia;
using Joki.LogicaAplicacion.CasosDeUso.Auditoria;
using Joki.LogicaAplicacion.CasosDeUso.Autenticacion;
using Joki.LogicaAplicacion.CasosDeUso.Beneficio;
using Joki.LogicaAplicacion.CasosDeUso.Clase;
using Joki.LogicaAplicacion.CasosDeUso.ConfiguracionCuota;
using Joki.LogicaAplicacion.CasosDeUso.Cuota;
using Joki.LogicaAplicacion.CasosDeUso.Desafio;
using Joki.LogicaAplicacion.CasosDeUso.Descuento;
using Joki.LogicaAplicacion.CasosDeUso.GestionAsistencias;
using Joki.LogicaAplicacion.CasosDeUso.Grupo;
using Joki.LogicaAplicacion.CasosDeUso.Historial;
using Joki.LogicaAplicacion.CasosDeUso.Notificacion;
using Joki.LogicaAplicacion.CasosDeUso.Pago;
using Joki.LogicaAplicacion.CasosDeUso.Perfil;
using Joki.LogicaAplicacion.CasosDeUso.Reactivacion;
using Joki.LogicaAplicacion.CasosDeUso.Recompensa;
using Joki.LogicaNegocio.InterfacesRepositorio;
using Joki.WebApi.Filtros;
using Joki.WebApi.Jobs;
using Joki.WebApi.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;
using System.Text;
using System.Threading.RateLimiting;


var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddDbContext<JokiContext>(options =>
    options.UseSqlServer(
        builder.Configuration.GetConnectionString("DefaultConnection"),
        sqlOptions =>
            sqlOptions.EnableRetryOnFailure(
                maxRetryCount: 5,
                maxRetryDelay: TimeSpan.FromSeconds(10),
                errorNumbersToAdd: null)));


builder.Services.AddHangfire(config => 
    config.UseSqlServerStorage(builder.Configuration.GetConnectionString("DefaultConnection")));
        builder.Services.AddHangfireServer();

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        var key = Encoding.UTF8.GetBytes(builder.Configuration["JwtSettings:SecretKey"]!);

        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,

            ValidIssuer = builder.Configuration["JwtSettings:Issuer"],
            ValidAudience = builder.Configuration["JwtSettings:Audience"],

            IssuerSigningKey = new SymmetricSecurityKey(key),

            RoleClaimType = ClaimTypes.Role
        };

        options.Events = new JwtBearerEvents
        {
            OnTokenValidated = context =>
            {
                var token = context.Request.Headers["Authorization"]
                    .ToString()
                    .Replace("Bearer ", "");

                var repo = context.HttpContext.RequestServices
                    .GetRequiredService<IRepositorioTokenRevocado>();

                if (repo.Existe(token))
                {
                    context.Fail("Token revocado");
                }

                return Task.CompletedTask;
            }
        };
    });

    builder.Services.AddScoped<IJwtGenerator, JwtGenerator>();
    builder.Services.AddScoped<IRepositorioUsuario, RepositorioUsuario>();
    builder.Services.AddScoped<IRepositorioAlumno, RepositorioAlumno>();
    builder.Services.AddScoped<IRegistrarAlumno, RegistrarAlumno>();
    builder.Services.AddScoped<ILoginUsuario, LoginUsuario>();
    builder.Services.AddScoped<IRepositorioTokenRevocado, RepositorioTokenRevocado>();
    builder.Services.AddScoped<ILogoutUsuario, LogoutUsuario>();
    builder.Services.AddScoped<IObtenerPerfilUsuario, ObtenerPerfilUsuario>();
    builder.Services.AddScoped<IActualizarPerfilUsuario, ActualizarPerfilUsuario>();
    builder.Services.AddScoped<IObtenerAlumnos, ObtenerAlumnos>();
    builder.Services.AddScoped<IObtenerAlumnoPorId, ObtenerAlumnoPorId>();
    builder.Services.AddScoped<IBajaAlumno, BajaAlumno>();
    builder.Services.AddScoped<IRepositorioGrupo, RepositorioGrupo>();
    builder.Services.AddScoped<ICrearGrupo, CrearGrupo>();
    builder.Services.AddScoped<IObtenerGrupos, ObtenerGrupos>();
    builder.Services.AddScoped<IObtenerGrupoPorId, ObtenerGrupoPorId>();
    builder.Services.AddScoped<IEditarGrupo, EditarGrupo>();
    builder.Services.AddScoped<IEliminarGrupo, EliminarGrupo>();
    builder.Services.AddScoped<IRepositorioListaEspera, RepositorioListaEspera>();
    builder.Services.AddScoped<IRepositorioInscripcion,RepositorioInscripcion > ();
    builder.Services.AddScoped<IRepositorioAsistencia, RepositorioAsistencia>();
    builder.Services.AddScoped<IRegistrarAsistencia, RegistrarAsistencia>();
    builder.Services.AddScoped<IRepositorioCuota, RepositorioCuota>();
    builder.Services.AddScoped<IInscribirAlumno, InscribirAlumno>();
    builder.Services.AddScoped<IRepositorioClase, RepositorioClase>();
    builder.Services.AddScoped<IEliminarClase, EliminarClase>();
    builder.Services.AddScoped<ICrearClase, CrearClase>();
    builder.Services.AddScoped<IObtenerClase, ObtenerClase>();
    builder.Services.AddScoped<IEditarClase, EditarClase>();
    builder.Services.AddScoped<IObtenerClases, ObtenerClases>();
    builder.Services.AddScoped<IObtenerClasesInscripto, ObtenerClasesInscripto>();
    builder.Services.AddScoped<IDesinscribirAlumno, DesinscribirAlumno>(); 
    builder.Services.AddScoped<IObtenerCuotaActualAlumno, ObtenerCuotaActualAlumno>();
    builder.Services.AddScoped<IObtenerMisCuotas, ObtenerMisCuotas>();
    builder.Services.AddScoped<IActualizarCuotasVencidas, ActualizarCuotasVencidas>();
    builder.Services.AddScoped<IGenerarCuotasMensuales, GenerarCuotasMensuales>();
    builder.Services.AddScoped<IMarcarCuotaComoPagada, MarcarCuotaComoPagada>();
    builder.Services.AddScoped<IRepositorioPago, RepositorioPago>();
    builder.Services.AddScoped<IRegistrarPago, RegistrarPago>();
    builder.Services.AddScoped<IObtenerPagosPorCuota, ObtenerPagosPorCuota>();
    builder.Services.AddScoped<ICrearPagoMercadoPago, CrearPagoMercadoPago>();
    builder.Services.AddScoped<IConfirmarPagoMercadoPago, ConfirmarPagoMercadoPago>();
    builder.Services.AddScoped<IObtenerMiHistorial,ObtenerMiHistorial>();
    builder.Services.AddScoped<IRepositorioRecuperacionContrasena, RepositorioRecuperacionContrasena>();
    builder.Services.AddScoped<ISolicitarRecuperacionContrasena, SolicitarRecuperacionContrasena>();
    builder.Services.AddScoped<IRestablecerContrasena, RestablecerContrasena>();
    builder.Services.Configure<MercadoPagoSettings>(builder.Configuration.GetSection("MercadoPago"));
    builder.Services.Configure<EmailSettings>(builder.Configuration.GetSection("EmailSettings"));
    builder.Services.Configure<GoogleAuthSettings>(builder.Configuration.GetSection("GoogleAuth"));
    builder.Services.AddScoped<ILoginGoogle, LoginGoogle>();
    builder.Services.AddScoped<IServicioEmail, ServicioEmailSendGrid>();
    builder.Services.AddScoped<CuotasJob>();
    builder.Services.AddScoped<BloqueoDeudaJob>();
    builder.Services.AddScoped<IRepositorioConfiguracionCuota, RepositorioConfiguracionCuota>();
    builder.Services.AddScoped<IObtenerConfiguracionCuota, ObtenerConfiguracionCuota>();
    builder.Services.AddScoped<IActualizarConfiguracionCuota, ActualizarConfiguracionCuota>();
    builder.Services.Configure<HangfireSettings>(builder.Configuration.GetSection("HangfireSettings"));
    builder.Services.AddScoped<HangfireAuthorizationFilter>();
    builder.Services.AddScoped<IRepositorioAuditoria, RepositorioAuditoria>();
    builder.Services.AddScoped<IRepositorioDescuento, RepositorioDescuento>();
    builder.Services.AddScoped<IRepositorioBeneficio, RepositorioBeneficio>();
    builder.Services.AddScoped<ICrearDescuento, CrearDescuento>();
    builder.Services.AddScoped<IObtenerDescuentos, ObtenerDescuentos>();
    builder.Services.AddScoped<IObtenerDescuentoPorId,ObtenerDescuentoPorId>();
    builder.Services.AddScoped<IActualizarDescuento,ActualizarDescuento>();
    builder.Services.AddScoped<IRepositorioDesafio, RepositorioDesafio>();
    builder.Services.AddScoped<IRepositorioRecompensa, RepositorioRecompensa>();
    builder.Services.AddScoped<ICrearDesafio,CrearDesafio>();
    builder.Services.AddScoped<IObtenerDesafios,ObtenerDesafios>();
    builder.Services.AddScoped<IActualizarDesafio, ActualizarDesafio>();
    builder.Services.AddScoped<IEliminarDesafio, EliminarDesafio>();
    builder.Services.AddScoped<ICrearRecompensa, CrearRecompensa>();
    builder.Services.AddScoped<IObtenerRecompensasPorDesafio, ObtenerRecompensasPorDesafio>();
    builder.Services.AddScoped<IRepositorioParticipacionDesafio, RepositorioParticipacionDesafio>();
    builder.Services.AddScoped<IAsignarGanadoresDesafio, AsignarGanadoresDesafio>();
    builder.Services.AddScoped<IActualizarRecompensa, ActualizarRecompensa>();
    builder.Services.AddScoped<IEliminarRecompensa, EliminarRecompensa>();
    builder.Services.AddScoped<IObtenerGanadoresDesafio, ObtenerGanadoresDesafio>();
    builder.Services.AddScoped<IParticiparDesafio, ParticiparDesafio>();
    builder.Services.AddScoped<IObtenerParticipantesDesafio, ObtenerParticipantesDesafio>();
    builder.Services.AddScoped<IObtenerMisDesafios, ObtenerMisDesafios>();
    builder.Services.AddScoped<IObtenerMisBeneficios, ObtenerMisBeneficios>();
    builder.Services.AddScoped<IEntregarBeneficioFisico, EntregarBeneficioFisico>();
    builder.Services.AddScoped<IObtenerBeneficiosFisicosPendientes,ObtenerBeneficiosFisicosPendientes>();
    builder.Services.AddScoped<IRepositorioNotificacion, RepositorioNotificacion>();
    builder.Services.AddScoped<IObtenerMisNotificaciones,ObtenerMisNotificaciones>();
    builder.Services.AddScoped<IMarcarNotificacionComoLeida,MarcarNotificacionComoLeida>();
    builder.Services.AddScoped<IBloquearAlumnosPorDeuda, BloquearAlumnosPorDeuda>();
    builder.Services.AddScoped<GenerarNotificacionesCuotas>();
    builder.Services.AddScoped<IObtenerAdminDashboard, ObtenerAdminDashboard>();
    builder.Services.AddScoped<IGenerar2FA, Generar2FA>();      
    builder.Services.AddScoped<IConfirmar2FA, Confirmar2FA>();
    builder.Services.AddScoped<IValidar2FA, Validar2FA>();
    builder.Services.AddScoped<IRegistrarAsistenciaGeolocalizacion,RegistrarAsistenciaGeolocalizacion>();
    builder.Services.AddScoped<IRepositorioSolicitudReactivacion,RepositorioSolicitudReactivacion>();
    builder.Services.AddScoped<ISolicitarReactivacionCuenta, SolicitarReactivacionCuenta>();
    builder.Services.AddScoped<IObtenerSolicitudesReactivacionPendientes, ObtenerSolicitudesReactivacionPendientes>();
    builder.Services.AddScoped<IResolverSolicitudReactivacion, ResolverSolicitudReactivacion>();
    builder.Services.AddScoped<IGenerarCuotaInicialAlumno, GenerarCuotaInicialAlumno>();
    builder.Services.AddScoped<IActualizarBloqueoDeudaAlumno, ActualizarBloqueoDeudaAlumno>();
    builder.Services.AddScoped<ISolicitarLoginSinPassword,SolicitarLoginSinPassword>();
    builder.Services.AddScoped<IValidarLoginSinPassword,ValidarLoginSinPassword>();
    builder.Services.AddScoped<IRepositorioCodigoLoginSinPassword,RepositorioCodigoLoginSinPassword>();
    builder.Services.AddScoped<IObtenerAuditorias, ObtenerAuditorias>();
    builder.Services.AddScoped<IObtenerAuditoriasPorUsuario,ObtenerAuditoriasPorUsuario>();
    builder.Services.AddScoped<IObtenerAuditoriasPorEntidad,ObtenerAuditoriasPorEntidad>();
    builder.Services.AddScoped<IMarcarTodasNotificacionesComoLeidas,MarcarTodasNotificacionesComoLeidas>();
    builder.Services.AddScoped<IResetearRachasMensuales, ResetearRachasMensuales>();
    builder.Services.AddScoped<RachasJob>();
    builder.Services.AddScoped<ICambiarEstadoClase, CambiarEstadoClase>();

builder.Services.AddRateLimiter(options =>
{
    options.RejectionStatusCode = StatusCodes.Status429TooManyRequests;

    options.AddFixedWindowLimiter("auth", opt =>
    {
        opt.PermitLimit = 5;
        opt.Window = TimeSpan.FromMinutes(1);
        opt.QueueProcessingOrder = QueueProcessingOrder.OldestFirst;
        opt.QueueLimit = 0;
    });

    options.AddFixedWindowLimiter("general", opt =>
    {
        opt.PermitLimit = 100;
        opt.Window = TimeSpan.FromMinutes(1);
        opt.QueueProcessingOrder = QueueProcessingOrder.OldestFirst;
        opt.QueueLimit = 0;
    });
});

builder.Services.AddAuthorization();

    builder.Services.AddCors(options =>
    {
        options.AddPolicy("AllowAll",
            policy =>
            {
                policy
                    .AllowAnyOrigin()
                    .AllowAnyHeader()
                    .AllowAnyMethod();
            });
    });

var app = builder.Build();


    app.UseSwagger();
    app.UseSwaggerUI();
app.UseHangfireDashboard("/hangfire", new DashboardOptions
{
    Authorization = new[]
 {
        app.Services.CreateScope()
            .ServiceProvider
            .GetRequiredService<HangfireAuthorizationFilter>()
    }
});

var zonaHorariaUruguay =
    TimeZoneInfo.FindSystemTimeZoneById(
        "Montevideo Standard Time");

RecurringJob.AddOrUpdate<CuotasJob>(
    "generar-cuotas-mensuales",
    job => job.GenerarCuotasMensuales(),
    Cron.Monthly(1),
    new RecurringJobOptions
    {
        TimeZone = zonaHorariaUruguay
    });

RecurringJob.AddOrUpdate<CuotasJob>(
    "actualizar-cuotas-vencidas",
    job => job.ActualizarCuotasVencidas(),
    Cron.Daily(),
    new RecurringJobOptions
    {
        TimeZone = zonaHorariaUruguay
    });

RecurringJob.AddOrUpdate<GenerarNotificacionesCuotas>(
    "generar-notificaciones-cuotas",
    job => job.Ejecutar(),
    Cron.Daily(9),
    new RecurringJobOptions
    {
        TimeZone = zonaHorariaUruguay
    });

RecurringJob.AddOrUpdate<BloqueoDeudaJob>(
    "bloquear-alumnos-por-deuda",
    job => job.Ejecutar(),
    Cron.Daily(0),
    new RecurringJobOptions
    {
        TimeZone = zonaHorariaUruguay
    });

RecurringJob.AddOrUpdate<RachasJob>(
    "resetear-rachas-mensuales",
    job => job.ResetearRachasMensuales(),
    "5 0 1 * *",
    new RecurringJobOptions
    {
        TimeZone = zonaHorariaUruguay
    });


using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<JokiContext>();
    var seed = new SeedData(context);
    seed.Run();
}

//app.UseHttpsRedirection();
app.UseCors("AllowAll");
app.UseAuthentication();
app.UseRateLimiter();
app.UseAuthorization();

app.MapControllers();

app.Run();
    
public partial class Program { }