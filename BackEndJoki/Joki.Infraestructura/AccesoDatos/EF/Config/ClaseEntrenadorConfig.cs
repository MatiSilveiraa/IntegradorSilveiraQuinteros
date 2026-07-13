using Joki.LogicaNegocio.Entidades;

using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Joki.Infraestructura.AccesoDatos.EF.Config
{
    public class ClaseEntrenadorConfig :
        IEntityTypeConfiguration<ClaseEntrenador>
    {
        public void Configure(
            EntityTypeBuilder<ClaseEntrenador> builder)
        {
            builder.ToTable("ClaseEntrenador");

            builder.HasKey(ce => ce.Id);

            builder.Property(ce => ce.EsPrincipal)
                .IsRequired();

            builder.Property(ce => ce.FechaAsignacion)
                .IsRequired();

            builder.HasOne(ce => ce.Clase)
                .WithMany(c => c.Entrenadores)
                .HasForeignKey(ce => ce.ClaseId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasOne(ce => ce.Entrenador)
                .WithMany(e => e.Clases)
                .HasForeignKey(ce => ce.EntrenadorId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasIndex(ce => new
            {
                ce.ClaseId,
                ce.EntrenadorId
            }).IsUnique();

            builder.HasIndex(ce => ce.ClaseId);

            builder.HasIndex(ce => ce.EntrenadorId);
        }
    }
}