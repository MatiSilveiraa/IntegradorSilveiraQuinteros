using Joki.LogicaNegocio.Entidades;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Joki.Infraestructura.AccesoDatos.EF.Config
{
    public class BeneficioConfig : IEntityTypeConfiguration<Beneficio>
    {
        public void Configure(EntityTypeBuilder<Beneficio> builder)
        {
            builder.ToTable("Beneficio");

            builder.HasKey(b => b.Id);

            builder.Property(b => b.Estado)
                .HasConversion<string>()
                .IsRequired();

            builder.Property(b => b.DescripcionBeneficio)
                .HasMaxLength(255);

            builder.HasOne(b => b.Alumno)
                .WithMany(a => a.Beneficios)
                .HasForeignKey(b => b.AlumnoId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasOne(b => b.Recompensa)
                .WithMany()
                .HasForeignKey(b => b.RecompensaId)
                .OnDelete(DeleteBehavior.SetNull);
            builder.HasIndex(b => b.AlumnoId);
        }
    }
}