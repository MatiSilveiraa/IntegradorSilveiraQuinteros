using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Joki.Infraestructura.Migrations
{
    /// <inheritdoc />
    public partial class CambioPasswordHashAContrasena : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Notificacion_Usuario_UsuarioId",
                table: "Notificacion");

            migrationBuilder.DropColumn(
                name: "PasswordHash",
                table: "Usuario");

            migrationBuilder.AddColumn<string>(
                name: "Contrasena",
                table: "Usuario",
                type: "nvarchar(255)",
                maxLength: 255,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddForeignKey(
                name: "FK_Notificacion_Usuario_UsuarioId",
                table: "Notificacion",
                column: "UsuarioId",
                principalTable: "Usuario",
                principalColumn: "UsuarioId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Notificacion_Usuario_UsuarioId",
                table: "Notificacion");

            migrationBuilder.DropColumn(
                name: "Contrasena",
                table: "Usuario");

            migrationBuilder.AddColumn<string>(
                name: "PasswordHash",
                table: "Usuario",
                type: "nvarchar(255)",
                maxLength: 255,
                nullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Notificacion_Usuario_UsuarioId",
                table: "Notificacion",
                column: "UsuarioId",
                principalTable: "Usuario",
                principalColumn: "UsuarioId",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
