using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Joki.Infraestructura.Migrations
{
    /// <inheritdoc />
    public partial class DescuentosConfigurables : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "DescuentoId",
                table: "Beneficio",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "FechaAsignacion",
                table: "Beneficio",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<int>(
                name: "MesesAplicados",
                table: "Beneficio",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "MesesDuracion",
                table: "Beneficio",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                name: "Descuentos",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Nombre = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Descripcion = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Porcentaje = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    MesesDuracion = table.Column<int>(type: "int", nullable: false),
                    Activo = table.Column<bool>(type: "bit", nullable: false),
                    Tipo = table.Column<int>(type: "int", nullable: false),
                    Alcance = table.Column<int>(type: "int", nullable: false),
                    DesafioId = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Descuentos", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Descuentos_Desafio_DesafioId",
                        column: x => x.DesafioId,
                        principalTable: "Desafio",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_Beneficio_DescuentoId",
                table: "Beneficio",
                column: "DescuentoId");

            migrationBuilder.CreateIndex(
                name: "IX_Descuentos_DesafioId",
                table: "Descuentos",
                column: "DesafioId");

            migrationBuilder.AddForeignKey(
                name: "FK_Beneficio_Descuentos_DescuentoId",
                table: "Beneficio",
                column: "DescuentoId",
                principalTable: "Descuentos",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Beneficio_Descuentos_DescuentoId",
                table: "Beneficio");

            migrationBuilder.DropTable(
                name: "Descuentos");

            migrationBuilder.DropIndex(
                name: "IX_Beneficio_DescuentoId",
                table: "Beneficio");

            migrationBuilder.DropColumn(
                name: "DescuentoId",
                table: "Beneficio");

            migrationBuilder.DropColumn(
                name: "FechaAsignacion",
                table: "Beneficio");

            migrationBuilder.DropColumn(
                name: "MesesAplicados",
                table: "Beneficio");

            migrationBuilder.DropColumn(
                name: "MesesDuracion",
                table: "Beneficio");
        }
    }
}
