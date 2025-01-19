using API.Dto;
using Application.Conversations;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

public class ConversationController : BaseApiController
{
    [HttpPost]
    [Authorize]
    public async Task<IActionResult> CreateOrGet(CreateConversationRequest request)
    {
        var result = await Mediator.Send(
            new CreateOrGet.Command { WorkspaceId = request.WorkspaceId, UserId = request.UserId }
        );
        return HandleResult(result);
    }
}
