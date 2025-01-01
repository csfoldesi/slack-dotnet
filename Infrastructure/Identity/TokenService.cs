using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using Application.Common.Interfaces;
using Domain;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace Infrastructure.Identity
{
    public class TokenService : ITokenService
    {
        private readonly IDataContext _dataContext;

        public TokenService(IDataContext dataContext)
        {
            _dataContext = dataContext;
        }

        public async Task<string> CreateAccessTokenAsync(User user, string? provider)
        {
            var claims = new List<Claim>
            {
                new(ClaimTypes.Name, user.Name),
                new(ClaimTypes.NameIdentifier, user.Id),
                new(ClaimTypes.Email, user.Email!),
                new("Provider", provider ?? ""),
            };

            var key =
                Environment.GetEnvironmentVariable("JWT_KEY")
                ?? throw new ApplicationException("JWT key is not configured.");
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key));
            var creds = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha512Signature);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.Now.AddMinutes(5),
                SigningCredentials = creds,
            };

            var tokenHandler = new JwtSecurityTokenHandler();

            var token = tokenHandler.CreateToken(tokenDescriptor);

            return tokenHandler.WriteToken(token);
        }

        public async Task<string> CreateRefreshTokenAsync(
            User user,
            CancellationToken cancellationToken = default
        )
        {
            var existingToken = await _dataContext.RefreshTokens.FirstOrDefaultAsync(
                x => x.UserId == user.Id,
                cancellationToken: cancellationToken
            );
            if (existingToken != null)
            {
                existingToken.IsRevoked = true;
            }

            var randomNumber = new byte[32];
            using var rng = RandomNumberGenerator.Create();
            rng.GetBytes(randomNumber);
            var tokenString = WebEncoders.Base64UrlEncode(randomNumber);
            var token = new RefreshToken
            {
                Token = tokenString,
                UserId = user.Id,
                ExpiryDate = DateTime.Now.AddDays(7),
            };
            _dataContext.RefreshTokens.Add(token);

            await _dataContext.SaveChangesAsync(cancellationToken);

            return tokenString;
        }

        public async Task ExtendRefreshTokenAsync(
            string token,
            CancellationToken cancellationToken = default
        )
        {
            var refreshToken = await _dataContext.RefreshTokens.FirstOrDefaultAsync(
                x => x.Token == token,
                cancellationToken: cancellationToken
            );
            if (refreshToken != null)
            {
                refreshToken.ExpiryDate = DateTime.Now.AddDays(7);
                await _dataContext.SaveChangesAsync(cancellationToken);
            }
        }

        public async Task<string?> GetUserIdByTokenAsync(
            string token,
            CancellationToken cancellationToken = default
        )
        {
            var refreshToken = await _dataContext.RefreshTokens.FirstOrDefaultAsync(
                x => x.Token == token && !x.IsRevoked && x.ExpiryDate >= DateTime.Now,
                cancellationToken: cancellationToken
            );

            return refreshToken?.UserId;
        }

        public async Task RevokeRefreshTokenAsync(
            string userId,
            CancellationToken cancellationToken = default
        )
        {
            var refreshTokens = await _dataContext
                .RefreshTokens.Where(x => x.UserId == userId)
                .ToListAsync(cancellationToken: cancellationToken);
            foreach (var refreshToken in refreshTokens)
            {
                refreshToken.IsRevoked = true;
            }
            await _dataContext.SaveChangesAsync(cancellationToken);
        }
    }
}
