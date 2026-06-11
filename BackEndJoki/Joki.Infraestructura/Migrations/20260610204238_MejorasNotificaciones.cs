using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Joki.Infraestructura.Migrations
{
    /// <inheritdoc />
    public partial class MejorasNotificaciones : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "EntidadReferencia",
                table: "Notificacion",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "EntidadReferenciaId",
                table: "Notificacion",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Titulo",
                table: "Notificacion",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "UrlDestino",
                table: "Notificacion",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "EntidadReferencia",
                table: "Notificacion");

            migrationBuilder.DropColumn(
                name: "EntidadReferenciaId",
                table: "Notificacion");

            migrationBuilder.DropColumn(
                name: "Titulo",
                table: "Notificacion");

            migrationBuilder.DropColumn(
                name: "UrlDestino",
                table: "Notificacion");
        }
    }
}
