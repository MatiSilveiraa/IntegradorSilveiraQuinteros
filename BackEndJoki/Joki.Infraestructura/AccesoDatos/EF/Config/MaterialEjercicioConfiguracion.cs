using Joki.LogicaNegocio.Entidades;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Joki.Infraestructura.AccesoDatos.EF.Config
{
    public class MaterialEjercicioConfig : IEntityTypeConfiguration<MaterialEjercicio>
    {
        public void Configure(EntityTypeBuilder<MaterialEjercicio> builder)
        {
            builder.ToTable("MaterialEjercicio");

            builder.HasKey(m => m.Id);

            builder.Property(m => m.Titulo)
                .IsRequired()
                .HasMaxLength(100);

            builder.Property(m => m.Url)
                .IsRequired()
                .HasMaxLength(300);

            builder.Property(m => m.Descripcion)
                .HasMaxLength(500);

            builder.HasOne(m => m.Clase)
                .WithMany(c => c.MaterialesEjercicio)
                .HasForeignKey(m => m.ClaseId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasIndex(m => m.ClaseId);
        }
    }
}