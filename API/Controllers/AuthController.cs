using API.Dto;
using Application.Common;
using Application.Common.Interfaces;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

public class AuthController : BaseApiController
{
    private readonly ITokenService _tokenService;
    private readonly IIdentityService _identityService;

    public AuthController(ITokenService tokenService, IIdentityService identityService)
    {
        _tokenService = tokenService;
        _identityService = identityService;
    }

    [HttpPost("signin")]
    public async Task<IActionResult> SignIn(SignInRequest signInRequest)
    {
        var result = await _identityService.GetUserAsync(
            signInRequest.Email,
            signInRequest.Password
        );

        if (result.ResultCode != ResultCode.Success)
        {
            return Unauthorized(ApiResponse<string>.Failure(result.Error));
        }

        var accessToken = await _tokenService.CreateAccessTokenAsync(
            result.Value!,
            result.Value!.AuthProvider
        );
        return HandleResult(Result<string>.Success(accessToken));
    }

    [HttpPost("signup")]
    public async Task<IActionResult> SignUp(CreateUserRequest createUserRequest)
    {
        var result = await _identityService.CreateUserAsync(
            createUserRequest.Name,
            createUserRequest.Email,
            createUserRequest.Password,
            createUserRequest.Avatar
        );
        if (result.ResultCode != ResultCode.Success)
        {
            return HandleResult(Result<CreateUserResponse>.Failure(result.Error));
        }

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

    [HttpGet("signin/github")]
    public IActionResult SignInGitHub()
    {
        return Challenge(
            new AuthenticationProperties { RedirectUri = "/api/auth/callback" },
            "GitHub"
        );
    }

    [HttpGet("signin/google")]
    public IActionResult SignInGoogle()
    {
        return Challenge(
            new AuthenticationProperties { RedirectUri = "/api/auth/callback" },
            "Google"
        );
    }

    [HttpGet("callback")]
    public async Task<IActionResult> Callback()
    {
        var authenticateResult = await HttpContext.AuthenticateAsync(
            CookieAuthenticationDefaults.AuthenticationScheme
        );
        if (!authenticateResult.Succeeded)
        {
            return BadRequest("Authentication failed");
        }

        var result = await _identityService.CreateOauthUserAsync(
            authenticateResult.Principal.Claims.ToList()
        );
        if (result.ResultCode == ResultCode.Error)
        {
            return HandleResult(Result<CreateUserResponse>.Failure(result.Error));
        }

        var user = result.Value!;
        var createUserResponse = new CreateUserResponse
        {
            Name = user.Name,
            Email = user.Email!,
            Avatar = user.Avatar,
            AccessToken = await _tokenService.CreateAccessTokenAsync(user, user.AuthProvider),
        };
        return HandleResult(Result<CreateUserResponse>.Success(createUserResponse));
    }

    [HttpGet("signout")]
    [Authorize]
    public async Task<IActionResult> SignOutHandler()
    {
        await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
        return SignOut(
            new AuthenticationProperties { },
            CookieAuthenticationDefaults.AuthenticationScheme
        );
    }
}
