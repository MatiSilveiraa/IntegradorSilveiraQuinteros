using Joki.LogicaNegocio.Entidades;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Joki.Infraestructura.AccesoDatos.EF.Config
{
    public class InscripcionConfig : IEntityTypeConfiguration<Inscripcion>
    {
        public void Configure(EntityTypeBuilder<Inscripcion> builder)
        {
            builder.ToTable("Inscripcion");

            builder.HasKey(i => i.Id);

            builder.Property(i => i.FechaInscripcion)
                .IsRequired();

            builder.HasOne(i => i.Alumno)
                .WithMany(a => a.Inscripciones)
                .HasForeignKey(i => i.AlumnoId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasOne(i => i.Grupo)
                .WithMany(g => g.Inscripciones)
                .HasForeignKey(i => i.GrupoId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasIndex(i => new { i.AlumnoId, i.GrupoId })
                .IsUnique();
        }
    }
}