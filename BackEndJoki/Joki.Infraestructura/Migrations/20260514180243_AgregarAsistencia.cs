using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Joki.Infraestructura.Migrations
{
    /// <inheritdoc />
    public partial class AgregarAsistencia : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Asistencia_Clase_ClaseId",
                table: "Asistencia");

            migrationBuilder.DropForeignKey(
                name: "FK_Asistencia_Usuario_AlumnoId",
                table: "Asistencia");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Asistencia",
                table: "Asistencia");

            migrationBuilder.DropIndex(
                name: "IX_Asistencia_AlumnoId_ClaseId",
                table: "Asistencia");

            migrationBuilder.DropColumn(
                name: "TipoRegistro",
                table: "Asistencia");

            migrationBuilder.RenameTable(
                name: "Asistencia",
                newName: "Asistencias");

            migrationBuilder.RenameIndex(
                name: "IX_Asistencia_ClaseId",
                table: "Asistencias",
                newName: "IX_Asistencias_ClaseId");

            migrationBuilder.AddColumn<int>(
                name: "AlumnoUsuarioId",
                table: "Asistencias",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "Fecha",
                table: "Asistencias",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<DateTime>(
                name: "FechaRegistro",
                table: "Asistencias",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<int>(
                name: "RegistradoPorId",
                table: "Asistencias",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddPrimaryKey(
                name: "PK_Asistencias",
                table: "Asistencias",
                column: "Id");

            migrationBuilder.CreateIndex(
                name: "IX_Asistencias_AlumnoId_ClaseId_Fecha",
                table: "Asistencias",
                columns: new[] { "AlumnoId", "ClaseId", "Fecha" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Asistencias_AlumnoUsuarioId",
                table: "Asistencias",
                column: "AlumnoUsuarioId");

            migrationBuilder.CreateIndex(
                name: "IX_Asistencias_RegistradoPorId",
                table: "Asistencias",
                column: "RegistradoPorId");

            migrationBuilder.AddForeignKey(
                name: "FK_Asistencias_Clase_ClaseId",
                table: "Asistencias",
                column: "ClaseId",
                principalTable: "Clase",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Asistencias_Usuario_AlumnoId",
                table: "Asistencias",
                column: "AlumnoId",
                principalTable: "Usuario",
                principalColumn: "UsuarioId",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Asistencias_Usuario_AlumnoUsuarioId",
                table: "Asistencias",
                column: "AlumnoUsuarioId",
                principalTable: "Usuario",
                principalColumn: "UsuarioId");

            migrationBuilder.AddForeignKey(
                name: "FK_Asistencias_Usuario_RegistradoPorId",
                table: "Asistencias",
                column: "RegistradoPorId",
                principalTable: "Usuario",
                principalColumn: "UsuarioId",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Asistencias_Clase_ClaseId",
                table: "Asistencias");

            migrationBuilder.DropForeignKey(
                name: "FK_Asistencias_Usuario_AlumnoId",
                table: "Asistencias");

            migrationBuilder.DropForeignKey(
                name: "FK_Asistencias_Usuario_AlumnoUsuarioId",
                table: "Asistencias");

            migrationBuilder.DropForeignKey(
                name: "FK_Asistencias_Usuario_RegistradoPorId",
                table: "Asistencias");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Asistencias",
                table: "Asistencias");

            migrationBuilder.DropIndex(
                name: "IX_Asistencias_AlumnoId_ClaseId_Fecha",
                table: "Asistencias");

            migrationBuilder.DropIndex(
                name: "IX_Asistencias_AlumnoUsuarioId",
                table: "Asistencias");

            migrationBuilder.DropIndex(
                name: "IX_Asistencias_RegistradoPorId",
                table: "Asistencias");

            migrationBuilder.DropColumn(
                name: "AlumnoUsuarioId",
                table: "Asistencias");

            migrationBuilder.DropColumn(
                name: "Fecha",
                table: "Asistencias");

            migrationBuilder.DropColumn(
                name: "FechaRegistro",
                table: "Asistencias");

            migrationBuilder.DropColumn(
                name: "RegistradoPorId",
                table: "Asistencias");

            migrationBuilder.RenameTable(
                name: "Asistencias",
                newName: "Asistencia");

            migrationBuilder.RenameIndex(
                name: "IX_Asistencias_ClaseId",
                table: "Asistencia",
                newName: "IX_Asistencia_ClaseId");

            migrationBuilder.AddColumn<string>(
                name: "TipoRegistro",
                table: "Asistencia",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Asistencia",
                table: "Asistencia",
                column: "Id");

            migrationBuilder.CreateIndex(
                name: "IX_Asistencia_AlumnoId_ClaseId",
                table: "Asistencia",
                columns: new[] { "AlumnoId", "ClaseId" },
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Asistencia_Clase_ClaseId",
                table: "Asistencia",
                column: "ClaseId",
                principalTable: "Clase",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Asistencia_Usuario_AlumnoId",
                table: "Asistencia",
                column: "AlumnoId",
                principalTable: "Usuario",
                principalColumn: "UsuarioId",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
