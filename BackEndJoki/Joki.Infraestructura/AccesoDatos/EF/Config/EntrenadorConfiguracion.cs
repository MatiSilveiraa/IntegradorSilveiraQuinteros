using Joki.LogicaNegocio.Entidades;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Joki.Infraestructura.AccesoDatos.EF.Config
{
    public class EntrenadorConfig : IEntityTypeConfiguration<Entrenador>
    {
        public void Configure(EntityTypeBuilder<Entrenador> builder)
        {

            builder.HasMany(e => e.Grupos)
                .WithOne(g => g.Entrenador)
                .HasForeignKey(g => g.EntrenadorId)
                .OnDelete(DeleteBehavior.Restrict);

        }
    }
}