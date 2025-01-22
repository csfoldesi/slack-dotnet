using Application.Storage;

namespace Application.Common.Interfaces;

public interface IStorageService
{
    Task<StorageItemDto?> AddAsync(string fileName, byte[] content);
    Task<string?> Delete(Guid publicId);
}
