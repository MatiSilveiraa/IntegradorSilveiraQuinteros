using Joki.LogicaNegocio.Entidades;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Joki.Infraestructura.AccesoDatos.EF.Config
{
    public class AuditoriaConfig : IEntityTypeConfiguration<Auditoria>
    {
        public void Configure(EntityTypeBuilder<Auditoria> builder)
        {
            builder.ToTable("Auditoria");

            builder.HasKey(a => a.Id);

            builder.Property(a => a.Entidad)
                .IsRequired()
                .HasMaxLength(100);

            builder.Property(a => a.Accion)
                .IsRequired()
                .HasMaxLength(100);

            builder.Property(a => a.EntidadId)
                .IsRequired();

            builder.Property(a => a.Fecha)
                .IsRequired();

            builder.HasOne(a => a.Usuario)
                .WithMany(u => u.Auditorias)
                .HasForeignKey(a => a.UsuarioId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasIndex(a => a.UsuarioId);

            builder.HasIndex(a => new { a.Entidad, a.EntidadId });

            builder.HasIndex(a => a.Fecha);
        }
    }
}