using Joki.LogicaNegocio.Entidades;

using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Joki.Infraestructura.AccesoDatos.EF.Config
{
    public class ClaseConfig :
        IEntityTypeConfiguration<Clase>
    {
        public void Configure(
            EntityTypeBuilder<Clase> builder)
        {
            builder.ToTable("Clase");

            builder.HasKey(c => c.Id);

            builder.Property(c => c.DiaSemana)
                .HasConversion<string>()
                .IsRequired();

            builder.Property(c => c.HoraInicio)
                .IsRequired();

            builder.Property(c => c.HoraFin)
                .IsRequired();

            builder.Property(c => c.CupoMaximo)
                .IsRequired();

            builder.Property(c => c.RadioGeolocalizacion)
                .HasColumnType("decimal(8,2)");

            builder.Property(c => c.Estado)
                .HasConversion<string>()
                .IsRequired();

            builder.OwnsOne(c => c.Ubicacion, ubicacion =>
            {
                ubicacion.Property(u => u.Latitud)
                    .HasColumnName("Latitud")
                    .HasColumnType("decimal(9,6)")
                    .IsRequired();

                ubicacion.Property(u => u.Longitud)
                    .HasColumnName("Longitud")
                    .HasColumnType("decimal(9,6)")
                    .IsRequired();

                ubicacion.Property(u => u.CodigoPostal)
                    .HasColumnName("CodigoPostal")
                    .HasMaxLength(20);
            });

            builder.HasOne(c => c.Grupo)
                .WithMany(g => g.Clases)
                .HasForeignKey(c => c.GrupoId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasMany(c => c.Asistencias)
                .WithOne(a => a.Clase)
                .HasForeignKey(a => a.ClaseId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasMany(c => c.Inscripciones)
                .WithOne(i => i.Clase)
                .HasForeignKey(i => i.ClaseId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasMany(c => c.SolicitudesCupo)
                .WithOne(s => s.Clase)
                .HasForeignKey(s => s.ClaseId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasMany(c => c.MaterialesEjercicio)
                .WithOne()
                .HasForeignKey("ClaseId")
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasIndex(c =>
                new
                {
                    c.GrupoId,
                    c.DiaSemana,
                    c.HoraInicio
                });

            builder.ToTable("Clase", t =>
            {
                t.HasCheckConstraint(
                    "CK_Clase_Cupo",
                    "[CupoMaximo] > 0"
                );

                t.HasCheckConstraint(
                    "CK_Clase_Horario",
                    "[HoraFin] > [HoraInicio]"
                );

                t.HasCheckConstraint(
                    "CK_Clase_Fechas",
                    "[FechaFin] IS NULL OR [FechaFin] >= [FechaInicio]"
                );
            });
        }
    }
}