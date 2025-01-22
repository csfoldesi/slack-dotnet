using Application.Common;
using Application.Common.Interfaces;
using MediatR;

namespace Application.Storage;

public class Create
{
    public class Command : IRequest<Result<StorageItemDto>>
    {
        public required string FileName { get; set; }

        public required byte[] Content { get; set; }
    }

    public class Handler : IRequestHandler<Command, Result<StorageItemDto>>
    {
        private readonly IStorageService _storageService;

        public Handler(IStorageService storageService)
        {
            _storageService = storageService;
        }

        public async Task<Result<StorageItemDto>> Handle(
            Command request,
            CancellationToken cancellationToken
        )
        {
            var result = await _storageService.AddAsync(request.FileName, request.Content);

            return Result<StorageItemDto>.Success(result);
        }
    }
}
