using Joki.LogicaNegocio.Entidades;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Joki.Infraestructura.AccesoDatos.EF.Config
{
    public class CuotaConfig : IEntityTypeConfiguration<Cuota>
    {
        public void Configure(EntityTypeBuilder<Cuota> builder)
        {
            builder.ToTable("Cuota");

            builder.HasKey(c => c.Id);

            builder.Property(c => c.Mes)
                .IsRequired();

            builder.Property(c => c.Anio)
                .IsRequired();

            builder.Property(c => c.MontoBase)
                .HasColumnType("decimal(10,2)")
                .IsRequired();

            builder.Property(c => c.Descuento)
                .HasColumnType("decimal(10,2)")
                .IsRequired();

            builder.Property(c => c.MontoFinal)
                .HasColumnType("decimal(10,2)")
                .IsRequired();

            builder.Property(c => c.Estado)
                .HasConversion<string>()
                .IsRequired();

            builder.HasOne(c => c.Alumno)
                .WithMany(a => a.Cuotas)
                .HasForeignKey(c => c.AlumnoId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasMany(c => c.Pagos)
                .WithOne()
                .HasForeignKey(p => p.CuotaId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasIndex(c => new { c.AlumnoId, c.Mes, c.Anio })
                .IsUnique();
        }
    }
}