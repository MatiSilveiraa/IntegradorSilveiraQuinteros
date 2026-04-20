using Joki.LogicaNegocio.Entidades;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Joki.Infraestructura.AccesoDatos.EF.Config
{
    public class ClaseConfig : IEntityTypeConfiguration<Clase>
    {
        public void Configure(EntityTypeBuilder<Clase> builder)
        {
            builder.ToTable("Clase");

            builder.HasKey(c => c.Id);

            builder.Property(c => c.Fecha)
                .IsRequired();

            builder.Property(c => c.Hora)
                .IsRequired();

            builder.Property(c => c.Estado)
                .HasConversion<string>()
                .IsRequired();

            builder.HasOne(c => c.Grupo)
                .WithMany(g => g.Clases)
                .HasForeignKey(c => c.GrupoId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasMany(c => c.Asistencias)
                .WithOne(a => a.Clase)
                .HasForeignKey(a => a.ClaseId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasMany(c => c.MaterialesEjercicio)
                .WithOne()
                .HasForeignKey("ClaseId")
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasIndex(c => new { c.GrupoId, c.Fecha, c.Hora });
        }
    }
}