using Application.Common;
using Application.Common.Interfaces;
using Domain;
using MediatR;

namespace Application.Storage;

public class Create
{
    public class Command : IRequest<Result<Guid>>
    {
        public required string FileName { get; set; }

        public required byte[] Content { get; set; }
    }

    public class Handler : IRequestHandler<Command, Result<Guid>>
    {
        private readonly IStorageService _storageService;
        private readonly IDataContext _dataContext;

        public Handler(IStorageService storageService, IDataContext dataContext)
        {
            _storageService = storageService;
            _dataContext = dataContext;
        }

        public async Task<Result<Guid>> Handle(Command request, CancellationToken cancellationToken)
        {
            var result = await _storageService.AddAsync(request.FileName, request.Content);

            if (result == null)
            {
                return Result<Guid>.Failure("Unable to upload teh file");
            }

            var image = new Image
            {
                Id = Guid.NewGuid(),
                StorageId = result.Name,
                Url = result.URI,
            };
            _dataContext.Images.Add(image);

            await _dataContext.SaveChangesAsync(cancellationToken);

            return Result<Guid>.Success(image.Id);
        }
    }
}
