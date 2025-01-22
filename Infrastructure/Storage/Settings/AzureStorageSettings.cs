namespace Infrastructure.Storage.Settings;

public class AzureStorageSettings
{
    public required string ConnectionString { get; set; }

    public required string Container { get; set; }
}
