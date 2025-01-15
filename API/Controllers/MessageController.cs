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
    [HttpPatch("{messageId}")]
    public async Task<IActionResult> Update(Guid messageId, [FromBody] UpdateMessageRequest request)
    {
        var result = await Mediator.Send(
            new Update.Command
            {
                Id = messageId,
                Body = request.Body,
                Image = request.Image,
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

    [Authorize]
    [HttpDelete("{messageId}")]
    public async Task<IActionResult> Delete(Guid messageId)
    {
        var result = await Mediator.Send(new Delete.Command { Id = messageId });
        return HandleResult(result);
    }

    [Authorize]
    [HttpPatch("{messageId}/reaction")]
    public async Task<IActionResult> ToggleReaction(
        Guid messageId,
        [FromBody] ToggleReactionRequest request
    )
    {
        var result = await Mediator.Send(
            new ToggleReaction.Command { MessageId = messageId, Value = request.Value }
        );
        return HandleResult(result);
    }
}
