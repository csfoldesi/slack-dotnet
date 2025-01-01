using System.Data;
using System.Security.Claims;
using Application.Common;
using Application.Common.Interfaces;
using Domain;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Identity
{
    public class IdentityService : IIdentityService
    {
        private readonly UserManager<User> _userManager;
        private readonly SignInManager<User> _signInManager;

        public IdentityService(UserManager<User> userManager, SignInManager<User> signInManager)
        {
            _userManager = userManager;
            _signInManager = signInManager;
        }

        public async Task<Result<User>> CreateOauthUserAsync(List<Claim> claims)
        {
            var email = claims.Find(c => c.Type == "oauth:email")?.Value ?? "";
            var name = claims.Find(c => c.Type == "oauth:name")?.Value ?? "";
            var avatar = claims.Find(c => c.Type == "oauth:avatar")?.Value ?? "";
            var provider = claims.Find(c => c.Type == "oauth:provider")?.Value ?? "";

            var user = await _userManager.Users.FirstOrDefaultAsync(x => x.Email == email);
            if (user != null)
            {
                return Result<User>.Success(user);
            }

            user = new User
            {
                Name = name,
                UserName = email,
                Email = email,
                Avatar = avatar,
                AuthProvider = provider,
            };
            var result = await _userManager.CreateAsync(user);
            return result.Succeeded
                ? Result<User>.Success(user)
                : Result<User>.Failure(result.Errors.Select(e => e.Description).First());
        }

        public async Task<Result<User>> CreateUserAsync(
            string name,
            string email,
            string password,
            string? avatar
        )
        {
            var user = new User
            {
                Name = name,
                UserName = email,
                Email = email,
                Avatar = avatar,
            };
            var result = await _userManager.CreateAsync(user, password);

            return result.Succeeded
                ? Result<User>.Success(user)
                : Result<User>.Failure(result.Errors.Select(e => e.Description).First());
        }

        public async Task<Result<User>> GetUserAsync(string email, string? password)
        {
            var user = await _userManager.Users.FirstOrDefaultAsync(x => x.Email == email);
            if (user == null)
            {
                return Result<User>.Failure("Unauthorized access");
            }
            var result = await _signInManager.CheckPasswordSignInAsync(user, password ?? "", false);

            return result.Succeeded
                ? Result<User>.Success(user)
                : Result<User>.Failure("Unauthorized access");
        }

        public async Task<Result<User>> GetUserByIdAsync(string userId)
        {
            var user = await _userManager.Users.FirstOrDefaultAsync(x => x.Id == userId);
            if (user == null)
            {
                return Result<User>.Failure("User not found");
            }
            return Result<User>.Success(user);
        }
    }
}
