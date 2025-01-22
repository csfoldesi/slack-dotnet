using Application.Common.Interfaces;
using Application.Storage;
using Azure.Storage.Blobs;
using Infrastructure.Storage.Settings;
using Microsoft.Extensions.Options;

namespace Infrastructure.Storage;

public class AzureStorageService : IStorageService
{
    private readonly BlobContainerClient _containerClient;

    public AzureStorageService(IOptions<AzureStorageSettings> config)
    {
        var serviceClient = new BlobServiceClient(config.Value.ConnectionString);
        _containerClient = serviceClient.GetBlobContainerClient(config.Value.Container);
        //_containerClient.CreateIfNotExists();
    }

    public async Task<StorageItemDto?> AddAsync(string fileName, byte[] content)
    {
        var client = _containerClient.GetBlobClient(fileName);
        await client.UploadAsync(new BinaryData(content), true);
        return new StorageItemDto { Name = client.Name, URI = client.Uri.ToString() };
    }

    public Task<string?> Delete(Guid publicId)
    {
        throw new NotImplementedException();
    }
}
