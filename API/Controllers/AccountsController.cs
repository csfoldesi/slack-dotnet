using API.Dto;
using Application.Common;
using Application.Common.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

public class AccountsController : BaseApiController
{
    private readonly IIdentityService _identityService;
    private readonly ITokenService _tokenService;

    public AccountsController(IIdentityService identityService, ITokenService tokenService)
    {
        _identityService = identityService;
        _tokenService = tokenService;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Create(CreateUserRequest createUserRequest)
    {
        var result = await _identityService.CreateUserAsync(
            createUserRequest.Name,
            createUserRequest.Email,
            createUserRequest.Password,
            createUserRequest.Avatar
        );
        if (result.ResultCode == Application.Common.ResultCode.Success)
        {
            var user = result.Value!;
            var createUserResponse = new CreateUserResponse
            {
                Name = user.Name,
                Email = user.Email!,
                Avatar = user.Avatar,
                AccessToken = await _tokenService.CreateAccessTokenAsync(user, null),
            };
            return HandleResult(Result<CreateUserResponse>.Success(createUserResponse));
        }
        else
        {
            return HandleResult(Result<CreateUserResponse>.Failure(result.Error));
        }
    }
}
