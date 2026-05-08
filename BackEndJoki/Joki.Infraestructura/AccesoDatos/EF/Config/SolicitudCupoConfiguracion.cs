using Joki.LogicaNegocio.Entidades;

using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Joki.Infraestructura.AccesoDatos.EF.Config
{
    public class SolicitudCupoConfig :
        IEntityTypeConfiguration<SolicitudCupo>
    {
        public void Configure(
            EntityTypeBuilder<SolicitudCupo> builder)
        {
            builder.ToTable("SolicitudCupo");

            builder.HasKey(s => s.Id);

            builder.Property(s => s.Estado)
                .HasConversion<string>()
                .IsRequired();

            builder.Property(s => s.Orden)
                .IsRequired();

            builder.Property(s => s.FechaSolicitud)
                .IsRequired();

            builder.HasOne(s => s.Alumno)
                .WithMany(a => a.SolicitudesCupo)
                .HasForeignKey(s => s.AlumnoId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasOne(s => s.Clase)
                .WithMany(c => c.SolicitudesCupo)
                .HasForeignKey(s => s.ClaseId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasIndex(s =>
                new
                {
                    s.AlumnoId,
                    s.ClaseId
                })
                .IsUnique();

            builder.HasIndex(s =>
                new
                {
                    s.ClaseId,
                    s.Orden
                })
                .IsUnique();

            builder.HasIndex(s => s.ClaseId);
        }
    }
}