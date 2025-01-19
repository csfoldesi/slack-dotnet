using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class Workspace_added_to_Conversation : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "WorkspaceId",
                table: "Conversations",
                type: "TEXT COLLATE NOCASE",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Conversations_WorkspaceId",
                table: "Conversations",
                column: "WorkspaceId");

            migrationBuilder.AddForeignKey(
                name: "FK_Conversations_Workspaces_WorkspaceId",
                table: "Conversations",
                column: "WorkspaceId",
                principalTable: "Workspaces",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Conversations_Workspaces_WorkspaceId",
                table: "Conversations");

            migrationBuilder.DropIndex(
                name: "IX_Conversations_WorkspaceId",
                table: "Conversations");

            migrationBuilder.DropColumn(
                name: "WorkspaceId",
                table: "Conversations");
        }
    }
}
