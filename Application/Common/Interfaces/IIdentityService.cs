using System.Security.Claims;
using Domain;

namespace Application.Common.Interfaces;

public interface IIdentityService
{
    Task<Result<User>> CreateUserAsync(string name, string email, string password, string? avatar);

    Task<Result<User>> CreateOauthUserAsync(List<Claim> claims);

    Task<Result<User>> GetUserAsync(string email, string? password);
}
