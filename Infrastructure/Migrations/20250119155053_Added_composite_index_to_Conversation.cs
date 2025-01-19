using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class Added_composite_index_to_Conversation : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Conversations_WorkspaceId",
                table: "Conversations");

            migrationBuilder.CreateIndex(
                name: "IX_Conversations_WorkspaceId_UserOneId_UserTwoId",
                table: "Conversations",
                columns: new[] { "WorkspaceId", "UserOneId", "UserTwoId" },
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Conversations_WorkspaceId_UserOneId_UserTwoId",
                table: "Conversations");

            migrationBuilder.CreateIndex(
                name: "IX_Conversations_WorkspaceId",
                table: "Conversations",
                column: "WorkspaceId");
        }
    }
}
