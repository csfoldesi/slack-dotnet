using API.Dto;
using Application.Channels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

public class ChannelController : BaseApiController
{
    [HttpGet("{channelId}")]
    [Authorize]
    public async Task<IActionResult> Get(Guid channelId)
    {
        var result = await Mediator.Send(new Get.Query { ChannelId = channelId });
        return HandleResult(result);
    }

    [HttpGet("list")]
    [Authorize]
    public async Task<IActionResult> List([FromQuery] QueryParams queryParams)
    {
        var result = await Mediator.Send(new List.Query { Params = queryParams });
        return HandleResult(result);
    }

    [HttpPost]
    [Authorize]
    public async Task<IActionResult> Create(CreateChannelRequest request)
    {
        var result = await Mediator.Send(
            new Create.Command { Name = request.Name, WorkspaceId = request.WorkspaceId }
        );
        return HandleResult(result);
    }

    [HttpPatch("{channelId}")]
    [Authorize]
    public async Task<IActionResult> Update(Guid channelId, [FromBody] UpdateChannelRequest request)
    {
        var result = await Mediator.Send(
            new Update.Command { ChannelId = channelId, Name = request.Name }
        );
        return HandleResult(result);
    }

    [HttpDelete("{channelId}")]
    [Authorize]
    public async Task<IActionResult> Delete(Guid channelId)
    {
        var result = await Mediator.Send(new Delete.Command { ChannelId = channelId });
        return HandleResult(result);
    }
}
