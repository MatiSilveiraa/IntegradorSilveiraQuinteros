using Joki.LogicaNegocio.Entidades;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Joki.Infraestructura.AccesoDatos.EF.Config
{
    public class RecompensaConfig : IEntityTypeConfiguration<Recompensa>
    {
        public void Configure(EntityTypeBuilder<Recompensa> builder)
        {
            builder.ToTable("Recompensa");

            builder.HasKey(r => r.Id);

            builder.Property(r => r.Descripcion)
                .IsRequired()
                .HasMaxLength(200);

            builder.Property(r => r.Tipo)
                .HasConversion<string>()
                .IsRequired();

            builder.HasOne(r => r.Desafio)
                .WithMany(d => d.Recompensas)
                .HasForeignKey(r => r.DesafioId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasMany(r => r.Beneficios)
                .WithOne(b => b.Recompensa)
                .HasForeignKey(b => b.RecompensaId)
                .OnDelete(DeleteBehavior.SetNull);

            builder.HasIndex(r => r.DesafioId);
        }
    }
}