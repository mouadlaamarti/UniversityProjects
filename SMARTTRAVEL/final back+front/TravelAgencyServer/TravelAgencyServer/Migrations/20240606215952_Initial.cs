using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace TravelAgencyServer.Migrations
{
    /// <inheritdoc />
    public partial class Initial : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Accounts",
                columns: table => new
                {
                    Mail = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Password = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Accounts", x => x.Mail);
                });

            migrationBuilder.CreateTable(
                name: "Destinations",
                columns: table => new
                {
                    Country = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Price = table.Column<float>(type: "real", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Destinations", x => x.Country);
                });

            migrationBuilder.CreateTable(
                name: "Questions",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Mail = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Text = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Questions", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Questions_Accounts_Mail",
                        column: x => x.Mail,
                        principalTable: "Accounts",
                        principalColumn: "Mail",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Reservations",
                columns: table => new
                {
                    ReservationId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Mail = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Country = table.Column<string>(type: "nvarchar(450)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Reservations", x => x.ReservationId);
                    table.ForeignKey(
                        name: "FK_Reservations_Accounts_Mail",
                        column: x => x.Mail,
                        principalTable: "Accounts",
                        principalColumn: "Mail",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Reservations_Destinations_Country",
                        column: x => x.Country,
                        principalTable: "Destinations",
                        principalColumn: "Country",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.InsertData(
                table: "Accounts",
                columns: new[] { "Mail", "Password" },
                values: new object[] { "test@mail.com", "1234" });

            migrationBuilder.InsertData(
                table: "Destinations",
                columns: new[] { "Country", "Price" },
                values: new object[,]
                {
                    { "Egypt", 1000f },
                    { "France", 1000f },
                    { "Italy", 1000f },
                    { "Maldives", 1000f },
                    { "Morocco", 1000f },
                    { "Romania", 1000f },
                    { "Seychelles Island", 1000f },
                    { "Turkey", 1000f }
                });

            migrationBuilder.CreateIndex(
                name: "IX_Questions_Mail",
                table: "Questions",
                column: "Mail");

            migrationBuilder.CreateIndex(
                name: "IX_Reservations_Country",
                table: "Reservations",
                column: "Country");

            migrationBuilder.CreateIndex(
                name: "IX_Reservations_Mail",
                table: "Reservations",
                column: "Mail");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Questions");

            migrationBuilder.DropTable(
                name: "Reservations");

            migrationBuilder.DropTable(
                name: "Accounts");

            migrationBuilder.DropTable(
                name: "Destinations");
        }
    }
}
