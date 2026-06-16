using Microsoft.EntityFrameworkCore;
using Joki.LogicaNegocio.Entidades;

namespace Joki.Infraestructura.AccesoDatos.EF
{
    public class JokiContext : DbContext
    {
        public JokiContext(DbContextOptions<JokiContext> options)
             : base(options)
        {
        }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
                optionsBuilder.UseSqlServer(
                    "Server=(localdb)\\MSSQLLocalDB;Database=JokiDb;Trusted_Connection=True;TrustServerCertificate=True"
                );
            }
        }

        public DbSet<Usuario> Usuarios { get; set; }
        public DbSet<Alumno> Alumnos { get; set; }
        public DbSet<Entrenador> Entrenadores { get; set; }
        public DbSet<ConfiguracionCuota> ConfiguracionesCuota { get; set; }
        public DbSet<Descuento> Descuentos { get; set; }
        public DbSet<Rol> Roles { get; set; }
        public DbSet<Grupo> Grupos { get; set; }
        public DbSet<Clase> Clases { get; set; }
        public DbSet<TokenRevocado> TokensRevocados { get; set; }
        public DbSet<Inscripcion> Inscripciones { get; set; }
        public DbSet<ListaEspera> ListaEspera { get; set; }
        public DbSet<SolicitudCupo> SolicitudesCupo { get; set; }
        public DbSet<Asistencia> Asistencias { get; set; }
        public DbSet<Cuota> Cuotas { get; set; }
        public DbSet<Pago> Pagos { get; set; }
        public DbSet<Desafio> Desafios { get; set; }
        public DbSet<Recompensa> Recompensas { get; set; }
        public DbSet<ParticipacionDesafio> ParticipacionesDesafio { get; set; }
        public DbSet<Beneficio> Beneficios { get; set; }
        public DbSet<Notificacion> Notificaciones { get; set; }
        public DbSet<Auditoria> Auditorias { get; set; }
        public DbSet<MaterialEjercicio> MaterialesEjercicio { get; set; }
        public DbSet<SolicitudReactivacion> SolicitudesReactivacion { get; set; }

        public DbSet<RecuperacionContrasena> RecuperacionesContrasena { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<ConfiguracionCuota>()
                .Property(c => c.MontoMensual)
                .HasPrecision(18, 2);

            modelBuilder.Entity<Descuento>()
                .Property(d => d.Porcentaje)
                .HasPrecision(18, 2);

            modelBuilder.ApplyConfigurationsFromAssembly(
                typeof(JokiContext).Assembly);

            base.OnModelCreating(modelBuilder);
        }
    }
}