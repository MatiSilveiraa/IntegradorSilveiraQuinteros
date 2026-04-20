using Joki.LogicaNegocio.Entidades;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Joki.Infraestructura.AccesoDatos.EF.Config
{
    public class DesafioConfig : IEntityTypeConfiguration<Desafio>
    {
        public void Configure(EntityTypeBuilder<Desafio> builder)
        {
            builder.ToTable("Desafio");

            builder.HasKey(d => d.Id);

            builder.Property(d => d.Titulo)
                .IsRequired()
                .HasMaxLength(100);

            builder.Property(d => d.Descripcion)
                .HasMaxLength(500);

            builder.Property(d => d.FechaInicio)
                .IsRequired();

            builder.Property(d => d.FechaFin)
                .IsRequired();

            builder.HasMany(d => d.Participaciones)
                .WithOne()
                .HasForeignKey(p => p.DesafioId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasMany(d => d.Recompensas)
                .WithOne(r => r.Desafio)
                .HasForeignKey(r => r.DesafioId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasCheckConstraint(
                "CK_Desafio_Fechas",
                "[FechaFin] >= [FechaInicio]"
            );

            builder.HasIndex(d => d.FechaInicio);
        }
    }
}