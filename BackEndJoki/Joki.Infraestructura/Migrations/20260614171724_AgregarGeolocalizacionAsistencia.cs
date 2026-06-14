using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Joki.Infraestructura.Migrations
{
    /// <inheritdoc />
    public partial class AgregarGeolocalizacionAsistencia : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Ubicacion_Direccion",
                table: "Clase",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "DistanciaMetros",
                table: "Asistencias",
                type: "decimal(18,2)",
                precision: 18,
                scale: 2,
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "Latitud",
                table: "Asistencias",
                type: "decimal(18,10)",
                precision: 18,
                scale: 10,
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "Longitud",
                table: "Asistencias",
                type: "decimal(18,10)",
                precision: 18,
                scale: 10,
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "RegistradaPorGeolocalizacion",
                table: "Asistencias",
                type: "bit",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Ubicacion_Direccion",
                table: "Clase");

            migrationBuilder.DropColumn(
                name: "DistanciaMetros",
                table: "Asistencias");

            migrationBuilder.DropColumn(
                name: "Latitud",
                table: "Asistencias");

            migrationBuilder.DropColumn(
                name: "Longitud",
                table: "Asistencias");

            migrationBuilder.DropColumn(
                name: "RegistradaPorGeolocalizacion",
                table: "Asistencias");
        }
    }
}
