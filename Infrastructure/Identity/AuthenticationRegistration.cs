using System.Net.Http.Headers;
using System.Security.Claims;
using System.Text.Json;
using Infrastructure.Settings;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.OAuth;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Infrastructure.Identity;

public static class AuthenticationRegistration
{
    private static string GITHUB_EMAIL_ENDPOINT = "https://api.github.com/user/emails";

    /*private static string GOOGLE_USERINFO_ENDPOINT =
        "https://www.googleapis.com/oauth2/v2/userinfo";*/

    public static AuthenticationBuilder AddGitHubAuthentication(
        this AuthenticationBuilder builder,
        IConfiguration configuration
    )
    {
        var config = configuration
            .GetSection(nameof(GitHubOAuthSettings))
            .Get<GitHubOAuthSettings>();

        builder.AddOAuth(
            "GitHub",
            options =>
            {
                options.ClientId = config!.ClientId;
                options.ClientSecret = config!.ClientSecret;
                options.CallbackPath = new PathString("/signin-github");
                options.AuthorizationEndpoint = "https://github.com/login/oauth/authorize";
                options.TokenEndpoint = "https://github.com/login/oauth/access_token";
                options.UserInformationEndpoint = "https://api.github.com/user";
                options.Scope.Add("read:user");
                options.Scope.Add("user:email");
                options.ClaimActions.MapJsonKey("oauth:avatar", "avatar_url");
                options.ClaimActions.MapJsonKey("oauth:email", "email");
                options.ClaimActions.MapJsonKey("oauth:name", "name");
                options.Events = new OAuthEvents
                {
                    OnCreatingTicket = async context =>
                    {
                        var request = new HttpRequestMessage(
                            HttpMethod.Get,
                            context.Options.UserInformationEndpoint
                        );
                        request.Headers.Accept.Add(
                            new MediaTypeWithQualityHeaderValue("application/json")
                        );
                        request.Headers.Authorization = new AuthenticationHeaderValue(
                            "Bearer",
                            context.AccessToken
                        );
                        var response = await context.Backchannel.SendAsync(
                            request,
                            HttpCompletionOption.ResponseHeadersRead,
                            context.HttpContext.RequestAborted
                        );
                        response.EnsureSuccessStatusCode();
                        var user = JsonDocument.Parse(await response.Content.ReadAsStringAsync());
                        context.RunClaimActions(user.RootElement);

                        var emailRequest = new HttpRequestMessage(
                            HttpMethod.Get,
                            GITHUB_EMAIL_ENDPOINT
                        );
                        emailRequest.Headers.Accept.Add(
                            new MediaTypeWithQualityHeaderValue("application/json")
                        );
                        emailRequest.Headers.Authorization = new AuthenticationHeaderValue(
                            "Bearer",
                            context.AccessToken
                        );
                        var emailResponse = await context.Backchannel.SendAsync(
                            emailRequest,
                            HttpCompletionOption.ResponseHeadersRead,
                            context.HttpContext.RequestAborted
                        );
                        emailResponse.EnsureSuccessStatusCode();
                        var emails = JsonDocument.Parse(
                            await emailResponse.Content.ReadAsStringAsync()
                        );
                        if (emails.RootElement.ValueKind == JsonValueKind.Array)
                        {
                            foreach (
                                var email in emails
                                    .RootElement.EnumerateArray()
                                    .Where(email => email.GetProperty("primary").GetBoolean())
                            )
                            {
                                context.Identity!.AddClaim(
                                    new Claim(
                                        "oauth:email",
                                        email.GetProperty("email").GetString()!
                                    )
                                );
                            }
                        }

                        context.Identity!.AddClaim(new Claim("oauth:provider", "GitHub"));
                    },
                };
            }
        );
        return builder;
    }

    public static AuthenticationBuilder AddGoogleAuthentication(
        this AuthenticationBuilder builder,
        IConfiguration configuration
    )
    {
        var config = configuration
            .GetSection(nameof(GoogleOAuthSettings))
            .Get<GoogleOAuthSettings>();

        builder.AddGoogle(options =>
        {
            options.ClientId = config!.ClientId;
            options.ClientSecret = config!.ClientSecret;
            options.CallbackPath = new PathString("/signin-google");
            options.ClaimActions.MapJsonKey("oauth:avatar", "picture");
            options.ClaimActions.MapJsonKey("oauth:email", "email");
            options.ClaimActions.MapJsonKey("oauth:name", "name");
            options.Events.OnCreatingTicket = async context =>
            {
                context.Identity!.AddClaim(new Claim("oauth:provider", "Google"));
            };
        });
        return builder;
    }
}
