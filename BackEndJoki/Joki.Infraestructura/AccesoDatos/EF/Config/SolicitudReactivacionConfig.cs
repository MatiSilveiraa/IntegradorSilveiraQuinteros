using Joki.LogicaNegocio.Entidades;
using Joki.LogicaNegocio.Enums;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Joki.Infraestructura.AccesoDatos.EF.Config
{
    public class SolicitudReactivacionConfig :
        IEntityTypeConfiguration<SolicitudReactivacion>
    {
        public void Configure(
            EntityTypeBuilder<SolicitudReactivacion> builder)
        {
            builder.ToTable("SolicitudReactivacion");

            builder.HasKey(s => s.Id);

            builder.Property(s => s.FechaSolicitud)
                .IsRequired();

            builder.Property(s => s.Estado)
                .HasConversion<string>()
                .IsRequired();

            builder.Property(s => s.MotivoAlumno)
                .HasMaxLength(500);

            builder.Property(s => s.RespuestaAdmin)
                .HasMaxLength(500);

            builder.HasOne(s => s.Alumno)
                .WithMany(a => a.SolicitudesReactivacion)
                .HasForeignKey(s => s.AlumnoId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasOne(s => s.Admin)
                .WithMany()
                .HasForeignKey(s => s.AdminId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}