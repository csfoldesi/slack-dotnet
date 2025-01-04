using Application.Members;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

public class MemberController : BaseApiController
{
    [HttpGet("{workspaceId}")]
    [Authorize]
    public async Task<IActionResult> GetMember(Guid workspaceId)
    {
        var result = await Mediator.Send(new GetMember.Query { WorkspaceId = workspaceId });
        return HandleResult(result);
    }

    [HttpGet("list/{workspaceId}")]
    [Authorize]
    public async Task<IActionResult> GetMemberList(Guid workspaceId)
    {
        var result = await Mediator.Send(new GetMemberList.Query { WorkspaceId = workspaceId });
        return HandleResult(result);
    }
}
