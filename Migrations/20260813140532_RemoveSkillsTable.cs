using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HirePoint.Migrations
{
    /// <inheritdoc />
    public partial class RemoveSkillsTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "JobQualifications");

            migrationBuilder.DropTable(
                name: "UserQualifications");

            migrationBuilder.DropTable(
                name: "UserSkills");

            migrationBuilder.DropTable(
                name: "Skills");

            migrationBuilder.DropColumn(
                name: "CVPath",
                table: "UserProfiles");

            migrationBuilder.AddColumn<string>(
                name: "QualificationRequired",
                table: "Jobs",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "Status",
                table: "Applications",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AddColumn<string>(
                name: "QualificationRequired",
                table: "Applications",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "QualificationRequired",
                table: "Jobs");

            migrationBuilder.DropColumn(
                name: "QualificationRequired",
                table: "Applications");

            migrationBuilder.AddColumn<string>(
                name: "CVPath",
                table: "UserProfiles",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Status",
                table: "Applications",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.CreateTable(
                name: "JobQualifications",
                columns: table => new
                {
                    JobQualificationID = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    JobID = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    QualificationID = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_JobQualifications", x => x.JobQualificationID);
                    table.ForeignKey(
                        name: "FK_JobQualifications_Jobs_JobID",
                        column: x => x.JobID,
                        principalTable: "Jobs",
                        principalColumn: "JobID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_JobQualifications_Qualifications_QualificationID",
                        column: x => x.QualificationID,
                        principalTable: "Qualifications",
                        principalColumn: "QualificationID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Skills",
                columns: table => new
                {
                    SkillID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    SkillName = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Skills", x => x.SkillID);
                });

            migrationBuilder.CreateTable(
                name: "UserQualifications",
                columns: table => new
                {
                    UserQualificationID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    QualificationID = table.Column<int>(type: "int", nullable: false),
                    UserID = table.Column<Guid>(type: "uniqueidentifier", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserQualifications", x => x.UserQualificationID);
                    table.ForeignKey(
                        name: "FK_UserQualifications_Qualifications_QualificationID",
                        column: x => x.QualificationID,
                        principalTable: "Qualifications",
                        principalColumn: "QualificationID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_UserQualifications_Users_UserID",
                        column: x => x.UserID,
                        principalTable: "Users",
                        principalColumn: "UserID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "UserSkills",
                columns: table => new
                {
                    UserSkillID = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    SkillID = table.Column<int>(type: "int", nullable: false),
                    UserID = table.Column<Guid>(type: "uniqueidentifier", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserSkills", x => x.UserSkillID);
                    table.ForeignKey(
                        name: "FK_UserSkills_Skills_SkillID",
                        column: x => x.SkillID,
                        principalTable: "Skills",
                        principalColumn: "SkillID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_UserSkills_Users_UserID",
                        column: x => x.UserID,
                        principalTable: "Users",
                        principalColumn: "UserID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_JobQualifications_JobID",
                table: "JobQualifications",
                column: "JobID");

            migrationBuilder.CreateIndex(
                name: "IX_JobQualifications_QualificationID",
                table: "JobQualifications",
                column: "QualificationID");

            migrationBuilder.CreateIndex(
                name: "IX_UserQualifications_QualificationID",
                table: "UserQualifications",
                column: "QualificationID");

            migrationBuilder.CreateIndex(
                name: "IX_UserQualifications_UserID",
                table: "UserQualifications",
                column: "UserID");

            migrationBuilder.CreateIndex(
                name: "IX_UserSkills_SkillID",
                table: "UserSkills",
                column: "SkillID");

            migrationBuilder.CreateIndex(
                name: "IX_UserSkills_UserID",
                table: "UserSkills",
                column: "UserID");
        }
    }
}
