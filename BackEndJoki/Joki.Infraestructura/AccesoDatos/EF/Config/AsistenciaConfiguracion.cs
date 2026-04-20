using Joki.LogicaNegocio.Entidades;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Joki.Infraestructura.AccesoDatos.EF.Config
{
    public class AsistenciaConfig : IEntityTypeConfiguration<Asistencia>
    {
        public void Configure(EntityTypeBuilder<Asistencia> builder)
        {
            builder.ToTable("Asistencia");

            builder.HasKey(a => a.Id);

            builder.Property(a => a.Presente)
                .IsRequired();

            builder.Property(a => a.TipoRegistro)
                .HasConversion<string>()
                .IsRequired();

            builder.HasOne(a => a.Alumno)
                .WithMany(a => a.Asistencias)
                .HasForeignKey(a => a.AlumnoId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasOne(a => a.Clase)
                .WithMany()
                .HasForeignKey(a => a.ClaseId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasIndex(a => new { a.AlumnoId, a.ClaseId })
                .IsUnique();
        }
    }
}