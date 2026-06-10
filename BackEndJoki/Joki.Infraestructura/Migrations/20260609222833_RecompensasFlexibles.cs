using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Joki.Infraestructura.Migrations
{
    /// <inheritdoc />
    public partial class RecompensasFlexibles : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "DescuentoId",
                table: "Recompensa",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "OtorgaCuotaGratis",
                table: "Recompensa",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "PremioFisico",
                table: "Recompensa",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "CuotaGratis",
                table: "Beneficio",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.CreateIndex(
                name: "IX_Recompensa_DescuentoId",
                table: "Recompensa",
                column: "DescuentoId");

            migrationBuilder.AddForeignKey(
                name: "FK_Recompensa_Descuentos_DescuentoId",
                table: "Recompensa",
                column: "DescuentoId",
                principalTable: "Descuentos",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Recompensa_Descuentos_DescuentoId",
                table: "Recompensa");

            migrationBuilder.DropIndex(
                name: "IX_Recompensa_DescuentoId",
                table: "Recompensa");

            migrationBuilder.DropColumn(
                name: "DescuentoId",
                table: "Recompensa");

            migrationBuilder.DropColumn(
                name: "OtorgaCuotaGratis",
                table: "Recompensa");

            migrationBuilder.DropColumn(
                name: "PremioFisico",
                table: "Recompensa");

            migrationBuilder.DropColumn(
                name: "CuotaGratis",
                table: "Beneficio");
        }
    }
}
