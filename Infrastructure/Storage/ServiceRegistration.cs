using Application.Common.Interfaces;
using Infrastructure.Storage.Settings;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Infrastructure.Storage;

public static class ServiceRegistration
{
    public static IServiceCollection AddStorageServices(
        this IServiceCollection services,
        IConfiguration configuration
    )
    {
        services.AddScoped<IStorageService, AzureStorageService>();
        services.Configure<AzureStorageSettings>(
            configuration.GetSection(nameof(AzureStorageSettings))
        );

        return services;
    }
}
