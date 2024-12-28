using API.Dto;
using Application.Common;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[Route("api/[controller]")]
[ApiController]
public class BaseApiController : ControllerBase
{
    protected ActionResult HandleResult<T>(Result<T> result)
    {
        return result.ResultCode switch
        {
            ResultCode.Success => Ok(ApiResponse<T>.Success(result.Value)),
            ResultCode.NotFound => NotFound(),
            ResultCode.Error => BadRequest(ApiResponse<T>.Failure(result.Error)),
            _ => Ok(),
        };
    }
}
