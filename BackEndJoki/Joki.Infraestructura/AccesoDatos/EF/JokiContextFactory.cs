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
                "Server=tcp:joki-training-server.database.windows.net,1433;Initial Catalog=JokiDB;Persist Security Info=False;User ID=dsharmain;Password=Enero.2020;MultipleActiveResultSets=False;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;"
            );

            return new JokiContext(optionsBuilder.Options);
        }
    }
}