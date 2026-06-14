using Joki.LogicaNegocio.Entidades;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Joki.Infraestructura.AccesoDatos.EF.Config
{
    public class AsistenciaConfig : IEntityTypeConfiguration<Asistencia>
    {
        public void Configure(EntityTypeBuilder<Asistencia> builder)
        {
            builder.HasKey(a => a.Id);

            builder.Property(a => a.Fecha)
                .IsRequired();

            builder.Property(a => a.Presente)
                .IsRequired();

            builder.Property(a => a.FechaRegistro)
                .IsRequired();

            builder.Property(a => a.Latitud)
                .HasPrecision(18, 10);

            builder.Property(a => a.Longitud)
                .HasPrecision(18, 10);

            builder.Property(a => a.DistanciaMetros)
                .HasPrecision(18, 2);

            builder.Property(a => a.RegistradaPorGeolocalizacion)
                .IsRequired();

            builder.HasOne(a => a.Alumno)
                .WithMany()
                .HasForeignKey(a => a.AlumnoId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasOne(a => a.Clase)
                .WithMany()
                .HasForeignKey(a => a.ClaseId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasOne(a => a.RegistradoPor)
                .WithMany()
                .HasForeignKey(a => a.RegistradoPorId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasIndex(a => new
            {
                a.AlumnoId,
                a.ClaseId,
                a.Fecha
            }).IsUnique();
        }
    }
}