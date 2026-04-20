using Joki.LogicaNegocio.Entidades;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Joki.Infraestructura.AccesoDatos.EF.Config
{
    public class ParticipacionDesafioConfig : IEntityTypeConfiguration<ParticipacionDesafio>
    {
        public void Configure(EntityTypeBuilder<ParticipacionDesafio> builder)
        {
            builder.ToTable("ParticipacionDesafio");

            builder.HasKey(p => p.Id);

            builder.Property(p => p.Resultado)
                .HasMaxLength(100);

            builder.Property(p => p.Ganador)
                .IsRequired();

            builder.HasOne(p => p.Alumno)
                .WithMany(a => a.ParticipacionesDesafio)
                .HasForeignKey(p => p.AlumnoId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasOne(p => p.Desafio)
                .WithMany(d => d.Participaciones)
                .HasForeignKey(p => p.DesafioId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasIndex(p => new { p.AlumnoId, p.DesafioId })
                .IsUnique();

            builder.HasIndex(p => p.DesafioId);
        }
    }
}