using Joki.LogicaNegocio.Entidades;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Joki.Infraestructura.AccesoDatos.EF.Config
{
    public class UsuarioConfig : IEntityTypeConfiguration<Usuario>
    {
        public void Configure(EntityTypeBuilder<Usuario> builder)
        {
            builder.ToTable("Usuario");

            builder.HasKey(u => u.UsuarioId);

            builder.OwnsOne(u => u.Nombre, nombre =>
            {
                nombre.Property(n => n.Valor)
                    .HasColumnName("Nombre")
                    .IsRequired()
                    .HasMaxLength(100);
            });

            builder.OwnsOne(u => u.Apellido, apellido =>
            {
                apellido.Property(a => a.Valor)
                    .HasColumnName("Apellido")
                    .IsRequired()
                    .HasMaxLength(100);
            });

            builder.OwnsOne(u => u.Email, email =>
            {
                email.Property(e => e.Valor)
                    .HasColumnName("Email")
                    .IsRequired();

                email.HasIndex(e => e.Valor)
                    .IsUnique();
            });

            builder.OwnsOne(u => u.Contrasena, contrasena =>
            {
                contrasena.Property(c => c.Valor)
                    .HasColumnName("Contrasena")
                    .IsRequired()
                    .HasMaxLength(255);
            });

            builder.Property(u => u.GoogleId)
                .HasMaxLength(100);

            builder.Property(u => u.Celular)
                .HasMaxLength(30);

            builder.Property(u => u.SociedadMedica)
                .HasMaxLength(100);

            builder.Property(u => u.Estado)
                .HasConversion<string>()
                .IsRequired();

            builder.Property(u => u.ProveedorAutenticacion)
                .HasConversion<string>()
                .IsRequired();

            builder.Property(u => u.Genero)
                .HasConversion<string>();

            builder.Property(u => u.FechaNacimiento);

            builder.Property(u => u.UltimoAcceso);

            builder.HasMany(u => u.Auditorias)
                 .WithOne(a => a.Usuario)
                 .HasForeignKey(a => a.UsuarioId)
                 .OnDelete(DeleteBehavior.NoAction);

            builder.HasDiscriminator<string>("TipoUsuario")
                .HasValue<Usuario>("Usuario")
                .HasValue<Alumno>("Alumno")
                .HasValue<Entrenador>("Entrenador");
        }
    }
}