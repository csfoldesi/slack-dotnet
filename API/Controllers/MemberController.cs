using API.Dto;
using Application.Members;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

public class MemberController : BaseApiController
{
    [HttpGet("{workspaceId}")]
    [Authorize]
    public async Task<IActionResult> GetMember(
        Guid workspaceId,
        [FromQuery] GetMembershipRequest request
    )
    {
        var result = await Mediator.Send(
            new Get.Query { WorkspaceId = workspaceId, UserId = request.UserId }
        );
        return HandleResult(result);
    }

    [HttpGet("list/{workspaceId}")]
    [Authorize]
    public async Task<IActionResult> GetMemberList(Guid workspaceId)
    {
        var result = await Mediator.Send(new List.Query { WorkspaceId = workspaceId });
        return HandleResult(result);
    }

    [HttpPatch("{workspaceId}")]
    [Authorize]
    public async Task<IActionResult> Update(
        Guid workspaceId,
        [FromBody] UpdateMemberRequest request
    )
    {
        var result = await Mediator.Send(
            new Update.Command
            {
                WorkspaceId = workspaceId,
                UserId = request.UserId,
                Role = request.Role,
            }
        );
        return HandleResult(result);
    }

    [HttpDelete("{workspaceId}/{userId}")]
    [Authorize]
    public async Task<IActionResult> Delete(Guid workspaceId, string userId)
    {
        var result = await Mediator.Send(
            new Delete.Command { WorkspaceId = workspaceId, UserId = userId }
        );
        return HandleResult(result);
    }
}
