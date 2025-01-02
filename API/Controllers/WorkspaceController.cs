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

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> Create(CreateWorkspaceRequest request)
        {
            var result = await Mediator.Send(new Create.Command { Name = request.Name });
            return HandleResult(result);
        }
    }
}
