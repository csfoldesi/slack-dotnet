using Application.Common.Interfaces;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly ITokenService _tokenService;

    public AuthController(ITokenService tokenService)
    {
        _tokenService = tokenService;
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
        var claims = authenticateResult.Principal.Claims.ToList();
        var email = claims.Find(c => c.Type == "oauth:email")?.Value ?? "";
        var name = claims.Find(c => c.Type == "oauth:name")?.Value ?? "";
        //var avatar = claims.Find(c => c.Type == "oauth:avatar")?.Value ?? "";
        var provider = claims.FirstOrDefault(c => c.Type == "oauth:provider")?.Value ?? "";
        var token = await _tokenService.CreateAccessTokenAsync(
            new Domain.User
            {
                Name = name,
                UserName = email,
                Id = email,
                Email = email,
            },
            provider
        );

        return Ok(token);
    }

    [HttpGet("signout")]
    [Authorize]
    public IActionResult SignOut()
    {
        return SignOut(
            new AuthenticationProperties { RedirectUri = "/" },
            CookieAuthenticationDefaults.AuthenticationScheme,
            "GitHub"
        );
    }

    [HttpGet("protected")]
    [Authorize]
    public IActionResult ProtectedEndpoint()
    {
        return Ok(new { Message = "You have accessed a protected endpoint!" });
    }
}
