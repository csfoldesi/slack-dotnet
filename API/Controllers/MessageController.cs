using API.Dto;
using Application.Messages;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

public class MessageController : BaseApiController
{
    [Authorize]
    [HttpPost]
    public async Task<IActionResult> Create(CreateMessageRequest request)
    {
        var result = await Mediator.Send(
            new Create.Command
            {
                Body = request.Body,
                Image = request.Image,
                WorkspaceId = request.WorkspaceId,
                ChannelId = request.ChannelId,
                ConversationId = request.ConversationId,
                ParentMessageId = request.ParentMessageId,
            }
        );
        return HandleResult(result);
    }

    [Authorize]
    [HttpGet]
    public async Task<IActionResult> List([FromQuery] MessageListRequest request)
    {
        var result = await Mediator.Send(
            new List.Query
            {
                ChannelId = request.ChannelId,
                ConversationId = request.ConversationId,
                ParentMessageId = request.ParentMessageId,
            }
        );
        return HandleResult(result);
    }
}
