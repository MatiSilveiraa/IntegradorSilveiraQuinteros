using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Joki.Infraestructura.Migrations
{
    /// <inheritdoc />
    public partial class AgregarClaseEntrenador : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "ClaseEntrenador",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ClaseId = table.Column<int>(type: "int", nullable: false),
                    EntrenadorId = table.Column<int>(type: "int", nullable: false),
                    EsPrincipal = table.Column<bool>(type: "bit", nullable: false),
                    FechaAsignacion = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ClaseEntrenador", x => x.Id);

                    table.ForeignKey(
                        name: "FK_ClaseEntrenador_Clase_ClaseId",
                        column: x => x.ClaseId,
                        principalTable: "Clase",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);

                    table.ForeignKey(
                        name: "FK_ClaseEntrenador_Usuario_EntrenadorId",
                        column: x => x.EntrenadorId,
                        principalTable: "Usuario",
                        principalColumn: "UsuarioId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ClaseEntrenador_ClaseId_EntrenadorId",
                table: "ClaseEntrenador",
                columns: new[] { "ClaseId", "EntrenadorId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_ClaseEntrenador_EntrenadorId",
                table: "ClaseEntrenador",
                column: "EntrenadorId");

            migrationBuilder.CreateIndex(
                name: "IX_ClaseEntrenador_ClaseId",
                table: "ClaseEntrenador",
                column: "ClaseId");

            // Migrar automáticamente los entrenadores actuales de los grupos
            migrationBuilder.Sql(@"
                INSERT INTO ClaseEntrenador
                (
                    ClaseId,
                    EntrenadorId,
                    EsPrincipal,
                    FechaAsignacion
                )
                SELECT
                    c.Id,
                    g.EntrenadorId,
                    CAST(1 AS bit),
                    GETUTCDATE()
                FROM Clase c
                INNER JOIN Grupo g
                    ON c.GrupoId = g.Id
                WHERE g.EntrenadorId IS NOT NULL;
            ");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ClaseEntrenador");
        }
    }
}