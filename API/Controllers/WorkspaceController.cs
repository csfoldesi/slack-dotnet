using API.Dto;
using Application.Workspaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class WorkspaceController : BaseApiController
    {
        [HttpGet]
        [Authorize]
        public async Task<IActionResult> List()
        {
            var result = await Mediator.Send(new List.Query { });
            return HandleResult(result);
        }

        [HttpGet("{workspaceId}")]
        [Authorize]
        public async Task<IActionResult> Get(Guid workspaceId)
        {
            var result = await Mediator.Send(new Get.Query { WorkspaceId = workspaceId });
            return HandleResult(result);
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> Create(CreateWorkspaceRequest request)
        {
            var result = await Mediator.Send(new Create.Command { Name = request.Name });
            return HandleResult(result);
        }

        [HttpPost("newjoincode/{workspaceId}")]
        [Authorize]
        public async Task<IActionResult> NewJoinCode(Guid workspaceId)
        {
            var result = await Mediator.Send(new NewJoinCode.Command { WorkspaceId = workspaceId });
            return HandleResult(result);
        }

        [HttpPatch("{workspaceId}")]
        [Authorize]
        public async Task<IActionResult> Update(
            Guid workspaceId,
            [FromBody] UpdateWorkspaceRequest request
        )
        {
            var result = await Mediator.Send(
                new Update.Command { WorkspaceId = workspaceId, Name = request.Name }
            );
            return HandleResult(result);
        }

        [HttpDelete("{workspaceId}")]
        [Authorize]
        public async Task<IActionResult> Delete(Guid workspaceId)
        {
            var result = await Mediator.Send(new Delete.Command { WorkspaceId = workspaceId });
            return HandleResult(result);
        }

        [HttpPost("{workspaceId}/join")]
        [Authorize]
        public async Task<IActionResult> Join(Guid workspaceId, [FromBody] JoinRequest request)
        {
            var result = await Mediator.Send(
                new Join.Command { WorkspaceId = workspaceId, JoinCode = request.Code }
            );
            return HandleResult(result);
        }
    }
}
