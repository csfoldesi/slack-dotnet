using System.Security.Claims;
using Infrastructure.Persistence;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;

namespace Infrastructure.Identity.Security;

public class IsWorkspaceMemberRequirement : IAuthorizationRequirement { }

public class IsWorkspaceMemberHandler : AuthorizationHandler<IsWorkspaceMemberRequirement>
{
    private readonly IHttpContextAccessor _httpContextAccessor;
    private readonly DataContext _dataContext;

    public IsWorkspaceMemberHandler(
        IHttpContextAccessor httpContextAccessor,
        DataContext dataContext
    )
    {
        _httpContextAccessor = httpContextAccessor;
        _dataContext = dataContext;
    }

    protected override async Task HandleRequirementAsync(
        AuthorizationHandlerContext context,
        IsWorkspaceMemberRequirement requirement
    )
    {
        var userId = _httpContextAccessor.HttpContext?.User?.FindFirstValue(
            ClaimTypes.NameIdentifier
        );
        if (userId == null)
            return;

        var httpContext = _httpContextAccessor.HttpContext;
        if (httpContext == null)
            return;

        var workspaceId = httpContext.Request.RouteValues["workspaceId"]?.ToString();

        if (workspaceId == null)
        {
            httpContext.Request.EnableBuffering();
            using (var reader = new StreamReader(httpContext.Request.Body))
            {
                httpContext.Request.Body.Position = 0;
                var body = await reader.ReadToEndAsync();
                dynamic? data = JsonConvert.DeserializeObject(body);
                workspaceId = data?.workspaceId?.ToString();
            }
            if (workspaceId == null)
                return;

            var membership = _dataContext
                .Members.Where(x => x.UserId == userId && x.WorkspaceId.ToString() == workspaceId)
                .FirstOrDefaultAsync();

            if (membership != null)
                context.Succeed(requirement);
        }
    }
}
