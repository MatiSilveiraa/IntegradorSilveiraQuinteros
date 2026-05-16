using Joki.LogicaNegocio.Entidades;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Joki.Infraestructura.AccesoDatos.EF.Config
{
    public class AlumnoConfig : IEntityTypeConfiguration<Alumno>
    {
        public void Configure(EntityTypeBuilder<Alumno> builder)
        {

            builder.Property(a => a.Peso)
                .HasColumnType("decimal(5,2)");

            builder.Property(a => a.Estatura)
                .HasColumnType("decimal(5,2)");

            builder.Property(a => a.IMC)
                .HasColumnType("decimal(5,2)");

            builder.HasMany(a => a.SolicitudesCupo)
                .WithOne()
                .HasForeignKey("AlumnoId")
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasMany(a => a.Inscripciones)
                .WithOne()
                .HasForeignKey("AlumnoId")
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasMany(a => a.Asistencias)
                .WithOne()
                .HasForeignKey("AlumnoId")
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasMany(a => a.Cuotas)
                .WithOne()
                .HasForeignKey("AlumnoId")
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasMany(a => a.ParticipacionesDesafio)
                .WithOne()
                .HasForeignKey("AlumnoId")
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasMany(a => a.Beneficios)
                .WithOne()
                .HasForeignKey("AlumnoId")
                .OnDelete(DeleteBehavior.Cascade);

            builder.Property(a => a.BloqueadoPorInasistencias)
                .IsRequired();

            builder.Property(a => a.RachaAsistenciaMensual)
                .IsRequired();

            builder.Property(a => a.MesRachaAsistencia)
                .IsRequired();

            builder.Property(a => a.AnioRachaAsistencia)
                .IsRequired();

            builder.Property(a => a.DescuentoRachaGenerado)
                .IsRequired();
        }
    }
}