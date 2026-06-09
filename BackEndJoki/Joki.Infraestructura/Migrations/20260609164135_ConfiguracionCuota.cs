using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Joki.Infraestructura.Migrations
{
    /// <inheritdoc />
    public partial class ConfiguracionCuota : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "ConfiguracionesCuota",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    MontoMensual = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    FechaDesde = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Activa = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ConfiguracionesCuota", x => x.Id);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ConfiguracionesCuota");
        }
    }
}
