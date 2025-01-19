using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class Member_replaced_to_User_in_Conversation : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Conversations_Members_MemberOneId",
                table: "Conversations");

            migrationBuilder.DropForeignKey(
                name: "FK_Conversations_Members_MemberTwoId",
                table: "Conversations");

            migrationBuilder.DropIndex(
                name: "IX_Conversations_MemberOneId",
                table: "Conversations");

            migrationBuilder.DropIndex(
                name: "IX_Conversations_MemberTwoId",
                table: "Conversations");

            migrationBuilder.DropColumn(
                name: "MemberOneId",
                table: "Conversations");

            migrationBuilder.DropColumn(
                name: "MemberTwoId",
                table: "Conversations");

            migrationBuilder.AddColumn<string>(
                name: "UserOneId",
                table: "Conversations",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "UserTwoId",
                table: "Conversations",
                type: "TEXT",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Conversations_UserOneId",
                table: "Conversations",
                column: "UserOneId");

            migrationBuilder.CreateIndex(
                name: "IX_Conversations_UserTwoId",
                table: "Conversations",
                column: "UserTwoId");

            migrationBuilder.AddForeignKey(
                name: "FK_Conversations_AspNetUsers_UserOneId",
                table: "Conversations",
                column: "UserOneId",
                principalTable: "AspNetUsers",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Conversations_AspNetUsers_UserTwoId",
                table: "Conversations",
                column: "UserTwoId",
                principalTable: "AspNetUsers",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Conversations_AspNetUsers_UserOneId",
                table: "Conversations");

            migrationBuilder.DropForeignKey(
                name: "FK_Conversations_AspNetUsers_UserTwoId",
                table: "Conversations");

            migrationBuilder.DropIndex(
                name: "IX_Conversations_UserOneId",
                table: "Conversations");

            migrationBuilder.DropIndex(
                name: "IX_Conversations_UserTwoId",
                table: "Conversations");

            migrationBuilder.DropColumn(
                name: "UserOneId",
                table: "Conversations");

            migrationBuilder.DropColumn(
                name: "UserTwoId",
                table: "Conversations");

            migrationBuilder.AddColumn<Guid>(
                name: "MemberOneId",
                table: "Conversations",
                type: "TEXT COLLATE NOCASE",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AddColumn<Guid>(
                name: "MemberTwoId",
                table: "Conversations",
                type: "TEXT COLLATE NOCASE",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.CreateIndex(
                name: "IX_Conversations_MemberOneId",
                table: "Conversations",
                column: "MemberOneId");

            migrationBuilder.CreateIndex(
                name: "IX_Conversations_MemberTwoId",
                table: "Conversations",
                column: "MemberTwoId");

            migrationBuilder.AddForeignKey(
                name: "FK_Conversations_Members_MemberOneId",
                table: "Conversations",
                column: "MemberOneId",
                principalTable: "Members",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Conversations_Members_MemberTwoId",
                table: "Conversations",
                column: "MemberTwoId",
                principalTable: "Members",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
