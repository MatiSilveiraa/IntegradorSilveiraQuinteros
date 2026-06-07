using Hangfire;
using Joki.CasoUsoCompartida.Configuracion;
using Joki.CasoUsoCompartida.InterfacesCasosUso.Alumno;
using Joki.CasoUsoCompartida.InterfacesCasosUso.Asistencia;
using Joki.CasoUsoCompartida.InterfacesCasosUso.Autenticacion;
using Joki.CasoUsoCompartida.InterfacesCasosUso.Clase;
using Joki.CasoUsoCompartida.InterfacesCasosUso.Cuota;
using Joki.CasoUsoCompartida.InterfacesCasosUso.Grupo;
using Joki.CasoUsoCompartida.InterfacesCasosUso.Historial;
using Joki.CasoUsoCompartida.InterfacesCasosUso.Pago;
using Joki.CasoUsoCompartida.InterfacesCasosUso.Perfil;
using Joki.Infraestructura.AccesoDatos.EF;
using Joki.Infraestructura.AccesoDatos.EF.Repositorios;
using Joki.Infraestructura.AccesoDatos.Repositorios;
using Joki.Infraestructura.Servicios;
using Joki.LogicaAplicacion.CasosDeUso.Alumno;
using Joki.LogicaAplicacion.CasosDeUso.Alumnos;
using Joki.LogicaAplicacion.CasosDeUso.Autenticacion;
using Joki.LogicaAplicacion.CasosDeUso.Clase;
using Joki.LogicaAplicacion.CasosDeUso.Cuota;
using Joki.LogicaAplicacion.CasosDeUso.GestionAsistencias;
using Joki.LogicaAplicacion.CasosDeUso.Grupo;
using Joki.LogicaAplicacion.CasosDeUso.Historial;
using Joki.LogicaAplicacion.CasosDeUso.Pago;
using Joki.LogicaAplicacion.CasosDeUso.Perfil;
using Joki.LogicaNegocio.InterfacesRepositorio;
using Joki.WebApi.Filtros;
using Joki.WebApi.Jobs;
using Joki.WebApi.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;
using System.Text;


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
    builder.Services.AddScoped<IServicioEmail, ServicioEmailSendGrid>();
    builder.Services.AddScoped<CuotasJob>();
    builder.Services.Configure<HangfireSettings>(builder.Configuration.GetSection("HangfireSettings"));
    builder.Services.AddScoped<HangfireAuthorizationFilter>();
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


using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<JokiContext>();
    var seed = new SeedData(context);
    seed.Run();
}

//app.UseHttpsRedirection();
app.UseCors("AllowAll");
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
    
public partial class Program { }