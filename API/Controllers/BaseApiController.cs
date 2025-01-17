using API.Dto;
using Application.Common;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[Route("api/[controller]")]
[ApiController]
public class BaseApiController : ControllerBase
{
    private IMediator? _mediator;

    protected IMediator Mediator =>
        _mediator ??= HttpContext.RequestServices.GetService<IMediator>()!;

    protected ActionResult HandleResult<T>(Result<T> result)
    {
        return result.ResultCode switch
        {
            ResultCode.Success => Ok(ApiResponse<T>.Success(result.Value)),
            ResultCode.NotFound => NotFound(),
            ResultCode.Error => BadRequest(ApiResponse<T>.Failure(result.Error)),
            ResultCode.Unauthorized => Unauthorized(result.Error),
            _ => Ok(),
        };
    }
}
