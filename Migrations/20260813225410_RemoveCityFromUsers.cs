using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HirePoint.Migrations
{
    public partial class RemoveCityFromUsers : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Users_Cities_CityID",
                table: "Users");

            migrationBuilder.DropIndex(
                name: "IX_Users_CityID",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "CityID",
                table: "Users");
        }
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "CityID",
                table: "Users",
                type: "int",
                nullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Users_Cities_CityID",
                table: "Users",
                column: "CityID",
                principalTable: "Cities",
                principalColumn: "CityID");
        }
    }
}
