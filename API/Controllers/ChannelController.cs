using Application.Channels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

public class ChannelController : BaseApiController
{
    [HttpGet("{workspaceId}")]
    [Authorize]
    public async Task<IActionResult> List(Guid workspaceId)
    {
        var result = await Mediator.Send(new List.Query { WorkspaceId = workspaceId });
        return HandleResult(result);
    }
}
