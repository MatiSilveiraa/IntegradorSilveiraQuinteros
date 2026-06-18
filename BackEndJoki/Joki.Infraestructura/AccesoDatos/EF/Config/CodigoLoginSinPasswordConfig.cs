using Joki.LogicaNegocio.Entidades;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Joki.Infraestructura.AccesoDatos.EF.Config
{
    public class CodigoLoginSinPasswordConfig :
        IEntityTypeConfiguration<CodigoLoginSinPassword>
    {
        public void Configure(
            EntityTypeBuilder<CodigoLoginSinPassword> builder)
        {
            builder.ToTable("CodigoLoginSinPassword");

            builder.HasKey(c => c.Id);

            builder.Property(c => c.Codigo)
                .IsRequired()
                .HasMaxLength(6);

            builder.Property(c => c.FechaCreacion)
                .IsRequired();

            builder.Property(c => c.FechaExpiracion)
                .IsRequired();

            builder.Property(c => c.Usado)
                .IsRequired();

            builder.HasOne(c => c.Usuario)
                .WithMany()
                .HasForeignKey(c => c.UsuarioId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}