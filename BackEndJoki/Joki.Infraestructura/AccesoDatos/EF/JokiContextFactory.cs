using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace Joki.Infraestructura.AccesoDatos.EF
{
    public class JokiContextFactory : IDesignTimeDbContextFactory<JokiContext>
    {
        public JokiContext CreateDbContext(string[] args)
        {
            var optionsBuilder = new DbContextOptionsBuilder<JokiContext>();

            optionsBuilder.UseSqlServer(
                "Server=(localdb)\\MSSQLLocalDB;Database=JokiDb;Trusted_Connection=True;TrustServerCertificate=True"
            );

            return new JokiContext(optionsBuilder.Options);
        }
    }
}