using Joki.CasoUsoCompartida.InterfacesCasosUso.Alumno;
using Joki.CasoUsoCompartida.InterfacesCasosUso.Autenticacion;
using Joki.Infraestructura.AccesoDatos.EF;
using Joki.Infraestructura.AccesoDatos.EF.Repositorios;
using Joki.LogicaAplicacion.CasosDeUso.Alumnos;
using Joki.LogicaAplicacion.CasosDeUso.Autenticacion;
using Joki.LogicaNegocio.InterfacesRepositorio;
using Joki.WebApi.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();

// ?? 1. Agrega los servicios de Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddDbContext<JokiContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["JwtSettings:Issuer"],
            ValidAudience = builder.Configuration["JwtSettings:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(builder.Configuration["JwtSettings:SecretKey"]!))
        };
    });

    builder.Services.AddScoped<IJwtGenerator, JwtGenerator>();
    builder.Services.AddScoped<IRepositorioUsuario, RepositorioUsuario>();
    builder.Services.AddScoped<IRepositorioAlumno, RepositorioAlumno>();
    builder.Services.AddScoped<IRegistrarAlumno, RegistrarAlumno>();
    builder.Services.AddScoped<ILoginUsuario, LoginUsuario>();
    builder.Services.AddAuthorization();

var app = builder.Build();

// ?? 2. Habilita el middleware de Swagger en el entorno de desarrollo (o siempre)
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<JokiContext>();
    var seed = new SeedData(context);
    seed.Run();
}

app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();