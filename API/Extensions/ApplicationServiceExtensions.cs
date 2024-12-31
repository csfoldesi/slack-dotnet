using System.Reflection;
using API.Services;
using Domain.Interfaces;

namespace API.Extensions;

public static class ApplicationServiceExtensions
{
    public static IServiceCollection AddAPIServices(
        this IServiceCollection services,
        IConfiguration configuration
    )
    {
        services.AddControllers();
        services.AddEndpointsApiExplorer();
        services.AddSwaggerGen();
        services.AddScoped<IUser, CurrentUser>();
        services.AddHttpContextAccessor();
        services.AddAutoMapper(Assembly.GetExecutingAssembly());

        services.AddCors(options =>
        {
            options.AddPolicy(
                "CorsPolicy",
                policy =>
                {
                    policy
                        .AllowAnyMethod()
                        .AllowAnyHeader()
                        .AllowCredentials()
                        .WithOrigins(
                            [.. configuration.GetSection("AllowedOrigins")!.Get<List<string>>()]
                        );
                }
            );
        });

        return services;
    }
}
