using System.Security.Claims;
using Domain;

namespace Application.Common.Interfaces;

public interface ITokenService
{
    public Task<string> CreateAccessTokenAsync(User user, string? provider);
}
