﻿using API.Dto;
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

    [HttpGet("list/{workspaceId}")]
    [Authorize]
    public async Task<IActionResult> List(Guid workspaceId)
    {
        var result = await Mediator.Send(new List.Query { WorkspaceId = workspaceId });
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
}
