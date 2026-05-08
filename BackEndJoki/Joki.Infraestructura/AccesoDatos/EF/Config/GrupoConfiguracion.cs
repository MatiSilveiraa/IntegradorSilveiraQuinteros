using Joki.LogicaNegocio.Entidades;

using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Joki.Infraestructura.AccesoDatos.EF.Config
{
    public class GrupoConfig :
        IEntityTypeConfiguration<Grupo>
    {
        public void Configure(
            EntityTypeBuilder<Grupo> builder)
        {
            builder.ToTable("Grupo");

            builder.HasKey(g => g.Id);

            builder.Property(g => g.Nombre)
                .IsRequired()
                .HasMaxLength(100);

            builder.Property(g => g.Nivel)
                .HasMaxLength(50);

            builder.Property(g => g.Estado)
                .HasConversion<string>()
                .IsRequired();

            builder.HasOne(g => g.Entrenador)
                .WithMany(e => e.Grupos)
                .HasForeignKey(g => g.EntrenadorId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasMany(g => g.Clases)
                .WithOne(c => c.Grupo)
                .HasForeignKey(c => c.GrupoId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}