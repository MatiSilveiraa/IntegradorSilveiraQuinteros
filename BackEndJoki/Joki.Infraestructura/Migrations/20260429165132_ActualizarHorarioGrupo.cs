using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Joki.Infraestructura.Migrations
{
    /// <inheritdoc />
    public partial class ActualizarHorarioGrupo : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Hora",
                table: "Grupo",
                newName: "HoraInicio");

            migrationBuilder.AddColumn<TimeSpan>(
                name: "HoraFin",
                table: "Grupo",
                type: "time",
                nullable: false,
                defaultValue: new TimeSpan(0, 0, 0, 0, 0));

            migrationBuilder.AddCheckConstraint(
                name: "CK_Grupo_Horario",
                table: "Grupo",
                sql: "[HoraFin] > [HoraInicio]");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropCheckConstraint(
                name: "CK_Grupo_Horario",
                table: "Grupo");

            migrationBuilder.DropColumn(
                name: "HoraFin",
                table: "Grupo");

            migrationBuilder.RenameColumn(
                name: "HoraInicio",
                table: "Grupo",
                newName: "Hora");
        }
    }
}
