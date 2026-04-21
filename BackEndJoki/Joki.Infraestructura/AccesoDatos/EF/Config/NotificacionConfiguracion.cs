using Joki.LogicaNegocio.Entidades;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Joki.Infraestructura.AccesoDatos.EF.Config
{
    public class NotificacionConfig : IEntityTypeConfiguration<Notificacion>
    {
        public void Configure(EntityTypeBuilder<Notificacion> builder)
        {
            builder.ToTable("Notificacion");

            builder.HasKey(n => n.Id);

            builder.Property(n => n.Mensaje)
                .IsRequired()
                .HasMaxLength(300);

            builder.Property(n => n.Tipo)
                .HasConversion<string>()
                .IsRequired();

            builder.Property(n => n.Leida)
                .IsRequired();

            builder.Property(n => n.FechaCreacion)
                .IsRequired();

            builder.Property(n => n.FechaLectura);

            builder.HasOne(n => n.Usuario)
                .WithMany(u => u.Notificaciones)
                .HasForeignKey(n => n.UsuarioId)
                .OnDelete(DeleteBehavior.NoAction);

            builder.HasIndex(n => n.UsuarioId);
            builder.HasIndex(n => n.Leida);
            builder.HasIndex(n => n.FechaCreacion);
        }
    }
}