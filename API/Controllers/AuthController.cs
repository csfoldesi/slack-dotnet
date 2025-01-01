using API.Dto;
using Application.Common;
using Application.Common.Interfaces;
using AutoMapper;
using Domain;
using Domain.Interfaces;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

public class AuthController : BaseApiController
{
    private readonly ITokenService _tokenService;
    private readonly IIdentityService _identityService;
    private readonly IConfiguration _config;
    private readonly IUser _user;
    private readonly IMapper _mapper;

    public AuthController(
        ITokenService tokenService,
        IIdentityService identityService,
        IConfiguration config,
        IUser user,
        IMapper mapper
    )
    {
        _tokenService = tokenService;
        _identityService = identityService;
        _config = config;
        _user = user;
        _mapper = mapper;
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
    public IActionResult SignInGitHub([FromQuery] string state = "")
    {
        return Challenge(
            new AuthenticationProperties { RedirectUri = $"/api/auth/callback?state={state}" },
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
    public async Task<IActionResult> Callback([FromQuery] string state = "")
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
        var accessToken = await _tokenService.CreateAccessTokenAsync(user, user.AuthProvider);
        var refreshToken = await _tokenService.CreateRefreshTokenAsync(user);

        /*var createUserResponse = new CreateUserResponse
        {
            Name = user.Name,
            Email = user.Email!,
            Avatar = user.Avatar,
            AccessToken = await _tokenService.CreateAccessTokenAsync(user, user.AuthProvider),
        };*/

        var cookieOptions = new CookieOptions
        {
            HttpOnly = true,
            Secure = true,
            SameSite = SameSiteMode.None,
        };
        Response.Cookies.Append("AccessToken", accessToken, cookieOptions);
        Response.Cookies.Append("RefreshToken", refreshToken, cookieOptions);
        var callbackUrl = _config.GetSection("OAuthCallbackUrl").Get<string>() ?? "";
        return Redirect(callbackUrl);
        //return Redirect($"{callbackUrl}?accessToken={accessToken}&refreshToken={refreshToken}");
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

    [HttpGet]
    [Authorize]
    public async Task<IActionResult> GetUserProfile()
    {
        var result = await _identityService.GetUserByIdAsync(_user.Id!);
        if (result.ResultCode != ResultCode.Success)
        {
            return Unauthorized(ApiResponse<UserProfile>.Failure(result.Error));
        }
        var userProfile = _mapper.Map<User, UserProfile>(result.Value!);
        return HandleResult(Result<UserProfile>.Success(userProfile));
    }

    [HttpGet("refresh-token")]
    public async Task<IActionResult> RefreshToken()
    {
        if (Request.Cookies.ContainsKey("RefreshToken"))
        {
            var refreshToken = Request.Cookies["RefreshToken"]!;
            var userId = await _tokenService.GetUserIdByTokenAsync(refreshToken);
            if (userId == null)
            {
                return Unauthorized(ApiResponse<string>.Failure("Invalid token"));
            }

            var result = await _identityService.GetUserByIdAsync(userId);
            if (result.ResultCode == ResultCode.Success)
            {
                var user = result.Value!;
                await _tokenService.ExtendRefreshTokenAsync(refreshToken);
                var accessToken = await _tokenService.CreateAccessTokenAsync(
                    user,
                    user.AuthProvider
                );

                var cookieOptions = new CookieOptions
                {
                    HttpOnly = true,
                    Secure = true,
                    SameSite = SameSiteMode.None,
                };
                Response.Cookies.Append("AccessToken", accessToken, cookieOptions);

                return HandleResult(Result<string>.Success("Ok"));
            }
            else
            {
                return Unauthorized(ApiResponse<string>.Failure(result.Error));
            }
        }
        return Unauthorized(ApiResponse<string>.Failure("Missing token"));
    }
}
