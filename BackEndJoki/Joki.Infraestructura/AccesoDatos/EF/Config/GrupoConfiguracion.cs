using Joki.LogicaNegocio.Entidades;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Joki.Infraestructura.AccesoDatos.EF.Config
{
    public class GrupoConfig : IEntityTypeConfiguration<Grupo>
    {
        public void Configure(EntityTypeBuilder<Grupo> builder)
        {
            builder.ToTable("Grupo");

            builder.HasKey(g => g.Id);

            builder.Property(g => g.Nombre)
                .IsRequired()
                .HasMaxLength(100);

            builder.Property(g => g.Nivel)
                .HasMaxLength(50);

            builder.Property(g => g.CupoMaximo)
                .IsRequired();

            builder.Property(g => g.DiaSemana)
                .HasConversion<string>()
                .IsRequired();

            builder.Property(g => g.HoraInicio)
                .IsRequired();

            builder.Property(g => g.HoraFin)
                .IsRequired();

            builder.Property(g => g.RadioGeolocalizacion)
                .HasColumnType("decimal(8,2)");

            builder.Property(g => g.Estado)
                .HasConversion<string>()
                .IsRequired();

            builder.OwnsOne(g => g.Ubicacion, ubicacion =>
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

            builder.HasOne(g => g.Entrenador)
                .WithMany(e => e.Grupos)
                .HasForeignKey(g => g.EntrenadorId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasMany(g => g.Inscripciones)
                .WithOne()
                .HasForeignKey(i => i.GrupoId);

            builder.HasMany(g => g.SolicitudesCupo)
                .WithOne()
                .HasForeignKey(s => s.GrupoId);

            builder.HasMany(g => g.Clases)
                .WithOne(c => c.Grupo)
                .HasForeignKey(c => c.GrupoId);

            builder.ToTable("Grupo", t =>
            {
                t.HasCheckConstraint(
                    "CK_Grupo_Fechas",
                    "[FechaFin] IS NULL OR [FechaFin] >= [FechaInicio]"
                );

                t.HasCheckConstraint(
                    "CK_Grupo_Cupo",
                    "[CupoMaximo] > 0"
                );

                t.HasCheckConstraint(
                    "CK_Grupo_Horario",
                    "[HoraFin] > [HoraInicio]"
                );
            });
        }
    }
}