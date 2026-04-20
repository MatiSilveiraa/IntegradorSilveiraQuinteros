using Joki.LogicaNegocio.Entidades;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Joki.Infraestructura.AccesoDatos.EF.Config
{
    public class PagoConfig : IEntityTypeConfiguration<Pago>
    {
        public void Configure(EntityTypeBuilder<Pago> builder)
        {
            builder.ToTable("Pago");

            builder.HasKey(p => p.Id);

            builder.Property(p => p.Monto)
                .HasColumnType("decimal(10,2)")
                .IsRequired();

            builder.Property(p => p.MedioPago)
                .HasConversion<string>()
                .IsRequired();

            builder.Property(p => p.FechaPago)
                .IsRequired();

            builder.HasOne(p => p.Cuota)
                .WithMany(c => c.Pagos)
                .HasForeignKey(p => p.CuotaId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasIndex(p => p.CuotaId);
            builder.HasIndex(p => p.FechaPago);
        }
    }
}