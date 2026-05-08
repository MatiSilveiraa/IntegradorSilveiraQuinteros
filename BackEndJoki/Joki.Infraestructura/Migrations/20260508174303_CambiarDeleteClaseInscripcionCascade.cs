using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Joki.Infraestructura.Migrations
{
    /// <inheritdoc />
    public partial class CambiarDeleteClaseInscripcionCascade : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Inscripcion_Clase_ClaseId",
                table: "Inscripcion");

            migrationBuilder.AddForeignKey(
                name: "FK_Inscripcion_Clase_ClaseId",
                table: "Inscripcion",
                column: "ClaseId",
                principalTable: "Clase",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Inscripcion_Clase_ClaseId",
                table: "Inscripcion");

            migrationBuilder.AddForeignKey(
                name: "FK_Inscripcion_Clase_ClaseId",
                table: "Inscripcion",
                column: "ClaseId",
                principalTable: "Clase",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
