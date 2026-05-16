using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Joki.Infraestructura.Migrations
{
    /// <inheritdoc />
    public partial class AgregarRachaAsistenciaMensual : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "AnioRachaAsistencia",
                table: "Usuario",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "DescuentoRachaGenerado",
                table: "Usuario",
                type: "bit",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "MesRachaAsistencia",
                table: "Usuario",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "RachaAsistenciaMensual",
                table: "Usuario",
                type: "int",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AnioRachaAsistencia",
                table: "Usuario");

            migrationBuilder.DropColumn(
                name: "DescuentoRachaGenerado",
                table: "Usuario");

            migrationBuilder.DropColumn(
                name: "MesRachaAsistencia",
                table: "Usuario");

            migrationBuilder.DropColumn(
                name: "RachaAsistenciaMensual",
                table: "Usuario");
        }
    }
}
