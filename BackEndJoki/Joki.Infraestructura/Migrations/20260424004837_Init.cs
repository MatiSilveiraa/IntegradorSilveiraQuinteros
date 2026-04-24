using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Joki.Infraestructura.Migrations
{
    /// <inheritdoc />
    public partial class Init : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Desafio",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Titulo = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Descripcion = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    FechaInicio = table.Column<DateTime>(type: "datetime2", nullable: false),
                    FechaFin = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Desafio", x => x.Id);
                    table.CheckConstraint("CK_Desafio_Fechas", "[FechaFin] >= [FechaInicio]");
                });

            migrationBuilder.CreateTable(
                name: "Rol",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Nombre = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Rol", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Recompensa",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Descripcion = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    Tipo = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    DesafioId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Recompensa", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Recompensa_Desafio_DesafioId",
                        column: x => x.DesafioId,
                        principalTable: "Desafio",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Usuario",
                columns: table => new
                {
                    UsuarioId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Nombre = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Apellido = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Email = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Contrasena = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    RolId = table.Column<int>(type: "int", nullable: false),
                    GoogleId = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    ProveedorAutenticacion = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    UltimoAcceso = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Genero = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    FechaNacimiento = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Celular = table.Column<string>(type: "nvarchar(30)", maxLength: 30, nullable: true),
                    SociedadMedica = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    Estado = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    TipoUsuario = table.Column<string>(type: "nvarchar(13)", maxLength: 13, nullable: false),
                    Peso = table.Column<decimal>(type: "decimal(5,2)", nullable: true),
                    Estatura = table.Column<decimal>(type: "decimal(5,2)", nullable: true),
                    IMC = table.Column<decimal>(type: "decimal(5,2)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Usuario", x => x.UsuarioId);
                    table.ForeignKey(
                        name: "FK_Usuario_Rol_RolId",
                        column: x => x.RolId,
                        principalTable: "Rol",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Auditoria",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UsuarioId = table.Column<int>(type: "int", nullable: false),
                    Entidad = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    EntidadId = table.Column<int>(type: "int", nullable: false),
                    Accion = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Fecha = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Auditoria", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Auditoria_Usuario_UsuarioId",
                        column: x => x.UsuarioId,
                        principalTable: "Usuario",
                        principalColumn: "UsuarioId");
                });

            migrationBuilder.CreateTable(
                name: "Beneficio",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    AlumnoId = table.Column<int>(type: "int", nullable: false),
                    RecompensaId = table.Column<int>(type: "int", nullable: true),
                    Estado = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    DescripcionBeneficio = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Beneficio", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Beneficio_Recompensa_RecompensaId",
                        column: x => x.RecompensaId,
                        principalTable: "Recompensa",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_Beneficio_Usuario_AlumnoId",
                        column: x => x.AlumnoId,
                        principalTable: "Usuario",
                        principalColumn: "UsuarioId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Cuota",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    AlumnoId = table.Column<int>(type: "int", nullable: false),
                    Mes = table.Column<int>(type: "int", nullable: false),
                    Anio = table.Column<int>(type: "int", nullable: false),
                    MontoBase = table.Column<decimal>(type: "decimal(10,2)", nullable: false),
                    Descuento = table.Column<decimal>(type: "decimal(10,2)", nullable: false),
                    MontoFinal = table.Column<decimal>(type: "decimal(10,2)", nullable: false),
                    Estado = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Cuota", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Cuota_Usuario_AlumnoId",
                        column: x => x.AlumnoId,
                        principalTable: "Usuario",
                        principalColumn: "UsuarioId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Grupo",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Nombre = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Nivel = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    CupoMaximo = table.Column<int>(type: "int", nullable: false),
                    DiaSemana = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Hora = table.Column<TimeSpan>(type: "time", nullable: false),
                    Latitud = table.Column<decimal>(type: "decimal(9,6)", nullable: false),
                    Longitud = table.Column<decimal>(type: "decimal(9,6)", nullable: false),
                    CodigoPostal = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    RadioGeolocalizacion = table.Column<decimal>(type: "decimal(8,2)", nullable: false),
                    EsFijo = table.Column<bool>(type: "bit", nullable: false),
                    FechaInicio = table.Column<DateTime>(type: "datetime2", nullable: false),
                    FechaFin = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Estado = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    EntrenadorId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Grupo", x => x.Id);
                    table.CheckConstraint("CK_Grupo_Cupo", "[CupoMaximo] > 0");
                    table.CheckConstraint("CK_Grupo_Fechas", "[FechaFin] IS NULL OR [FechaFin] >= [FechaInicio]");
                    table.ForeignKey(
                        name: "FK_Grupo_Usuario_EntrenadorId",
                        column: x => x.EntrenadorId,
                        principalTable: "Usuario",
                        principalColumn: "UsuarioId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Notificacion",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UsuarioId = table.Column<int>(type: "int", nullable: false),
                    FechaCreacion = table.Column<DateTime>(type: "datetime2", nullable: false),
                    FechaLectura = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Mensaje = table.Column<string>(type: "nvarchar(300)", maxLength: 300, nullable: false),
                    Tipo = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Leida = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Notificacion", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Notificacion_Usuario_UsuarioId",
                        column: x => x.UsuarioId,
                        principalTable: "Usuario",
                        principalColumn: "UsuarioId");
                });

            migrationBuilder.CreateTable(
                name: "ParticipacionDesafio",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    AlumnoId = table.Column<int>(type: "int", nullable: false),
                    DesafioId = table.Column<int>(type: "int", nullable: false),
                    Resultado = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Ganador = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ParticipacionDesafio", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ParticipacionDesafio_Desafio_DesafioId",
                        column: x => x.DesafioId,
                        principalTable: "Desafio",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ParticipacionDesafio_Usuario_AlumnoId",
                        column: x => x.AlumnoId,
                        principalTable: "Usuario",
                        principalColumn: "UsuarioId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Pago",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CuotaId = table.Column<int>(type: "int", nullable: false),
                    MedioPago = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    FechaPago = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Monto = table.Column<decimal>(type: "decimal(10,2)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Pago", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Pago_Cuota_CuotaId",
                        column: x => x.CuotaId,
                        principalTable: "Cuota",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Clase",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    GrupoId = table.Column<int>(type: "int", nullable: false),
                    Fecha = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Hora = table.Column<TimeSpan>(type: "time", nullable: false),
                    Estado = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Clase", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Clase_Grupo_GrupoId",
                        column: x => x.GrupoId,
                        principalTable: "Grupo",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Inscripcion",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    AlumnoId = table.Column<int>(type: "int", nullable: false),
                    GrupoId = table.Column<int>(type: "int", nullable: false),
                    FechaInscripcion = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Inscripcion", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Inscripcion_Grupo_GrupoId",
                        column: x => x.GrupoId,
                        principalTable: "Grupo",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Inscripcion_Usuario_AlumnoId",
                        column: x => x.AlumnoId,
                        principalTable: "Usuario",
                        principalColumn: "UsuarioId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "SolicitudCupo",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    AlumnoId = table.Column<int>(type: "int", nullable: false),
                    GrupoId = table.Column<int>(type: "int", nullable: false),
                    Estado = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Orden = table.Column<int>(type: "int", nullable: false),
                    FechaSolicitud = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SolicitudCupo", x => x.Id);
                    table.ForeignKey(
                        name: "FK_SolicitudCupo_Grupo_GrupoId",
                        column: x => x.GrupoId,
                        principalTable: "Grupo",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_SolicitudCupo_Usuario_AlumnoId",
                        column: x => x.AlumnoId,
                        principalTable: "Usuario",
                        principalColumn: "UsuarioId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Asistencia",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    AlumnoId = table.Column<int>(type: "int", nullable: false),
                    ClaseId = table.Column<int>(type: "int", nullable: false),
                    Presente = table.Column<bool>(type: "bit", nullable: false),
                    TipoRegistro = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Asistencia", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Asistencia_Clase_ClaseId",
                        column: x => x.ClaseId,
                        principalTable: "Clase",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Asistencia_Usuario_AlumnoId",
                        column: x => x.AlumnoId,
                        principalTable: "Usuario",
                        principalColumn: "UsuarioId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "MaterialEjercicio",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ClaseId = table.Column<int>(type: "int", nullable: false),
                    Titulo = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Url = table.Column<string>(type: "nvarchar(300)", maxLength: 300, nullable: false),
                    Descripcion = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MaterialEjercicio", x => x.Id);
                    table.ForeignKey(
                        name: "FK_MaterialEjercicio_Clase_ClaseId",
                        column: x => x.ClaseId,
                        principalTable: "Clase",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Asistencia_AlumnoId_ClaseId",
                table: "Asistencia",
                columns: new[] { "AlumnoId", "ClaseId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Asistencia_ClaseId",
                table: "Asistencia",
                column: "ClaseId");

            migrationBuilder.CreateIndex(
                name: "IX_Auditoria_Entidad_EntidadId",
                table: "Auditoria",
                columns: new[] { "Entidad", "EntidadId" });

            migrationBuilder.CreateIndex(
                name: "IX_Auditoria_Fecha",
                table: "Auditoria",
                column: "Fecha");

            migrationBuilder.CreateIndex(
                name: "IX_Auditoria_UsuarioId",
                table: "Auditoria",
                column: "UsuarioId");

            migrationBuilder.CreateIndex(
                name: "IX_Beneficio_AlumnoId",
                table: "Beneficio",
                column: "AlumnoId");

            migrationBuilder.CreateIndex(
                name: "IX_Beneficio_RecompensaId",
                table: "Beneficio",
                column: "RecompensaId");

            migrationBuilder.CreateIndex(
                name: "IX_Clase_GrupoId_Fecha_Hora",
                table: "Clase",
                columns: new[] { "GrupoId", "Fecha", "Hora" });

            migrationBuilder.CreateIndex(
                name: "IX_Cuota_AlumnoId_Mes_Anio",
                table: "Cuota",
                columns: new[] { "AlumnoId", "Mes", "Anio" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Desafio_FechaInicio",
                table: "Desafio",
                column: "FechaInicio");

            migrationBuilder.CreateIndex(
                name: "IX_Grupo_EntrenadorId",
                table: "Grupo",
                column: "EntrenadorId");

            migrationBuilder.CreateIndex(
                name: "IX_Inscripcion_AlumnoId_GrupoId",
                table: "Inscripcion",
                columns: new[] { "AlumnoId", "GrupoId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Inscripcion_GrupoId",
                table: "Inscripcion",
                column: "GrupoId");

            migrationBuilder.CreateIndex(
                name: "IX_MaterialEjercicio_ClaseId",
                table: "MaterialEjercicio",
                column: "ClaseId");

            migrationBuilder.CreateIndex(
                name: "IX_Notificacion_FechaCreacion",
                table: "Notificacion",
                column: "FechaCreacion");

            migrationBuilder.CreateIndex(
                name: "IX_Notificacion_Leida",
                table: "Notificacion",
                column: "Leida");

            migrationBuilder.CreateIndex(
                name: "IX_Notificacion_UsuarioId",
                table: "Notificacion",
                column: "UsuarioId");

            migrationBuilder.CreateIndex(
                name: "IX_Pago_CuotaId",
                table: "Pago",
                column: "CuotaId");

            migrationBuilder.CreateIndex(
                name: "IX_Pago_FechaPago",
                table: "Pago",
                column: "FechaPago");

            migrationBuilder.CreateIndex(
                name: "IX_ParticipacionDesafio_AlumnoId_DesafioId",
                table: "ParticipacionDesafio",
                columns: new[] { "AlumnoId", "DesafioId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_ParticipacionDesafio_DesafioId",
                table: "ParticipacionDesafio",
                column: "DesafioId");

            migrationBuilder.CreateIndex(
                name: "IX_Recompensa_DesafioId",
                table: "Recompensa",
                column: "DesafioId");

            migrationBuilder.CreateIndex(
                name: "IX_Rol_Nombre",
                table: "Rol",
                column: "Nombre",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_SolicitudCupo_AlumnoId_GrupoId",
                table: "SolicitudCupo",
                columns: new[] { "AlumnoId", "GrupoId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_SolicitudCupo_GrupoId",
                table: "SolicitudCupo",
                column: "GrupoId");

            migrationBuilder.CreateIndex(
                name: "IX_SolicitudCupo_GrupoId_Orden",
                table: "SolicitudCupo",
                columns: new[] { "GrupoId", "Orden" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Usuario_Email",
                table: "Usuario",
                column: "Email",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Usuario_RolId",
                table: "Usuario",
                column: "RolId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Asistencia");

            migrationBuilder.DropTable(
                name: "Auditoria");

            migrationBuilder.DropTable(
                name: "Beneficio");

            migrationBuilder.DropTable(
                name: "Inscripcion");

            migrationBuilder.DropTable(
                name: "MaterialEjercicio");

            migrationBuilder.DropTable(
                name: "Notificacion");

            migrationBuilder.DropTable(
                name: "Pago");

            migrationBuilder.DropTable(
                name: "ParticipacionDesafio");

            migrationBuilder.DropTable(
                name: "SolicitudCupo");

            migrationBuilder.DropTable(
                name: "Recompensa");

            migrationBuilder.DropTable(
                name: "Clase");

            migrationBuilder.DropTable(
                name: "Cuota");

            migrationBuilder.DropTable(
                name: "Desafio");

            migrationBuilder.DropTable(
                name: "Grupo");

            migrationBuilder.DropTable(
                name: "Usuario");

            migrationBuilder.DropTable(
                name: "Rol");
        }
    }
}
