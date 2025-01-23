using Application.Common;
using Application.Common.Interfaces;
using Domain.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Storage;

public class Delete
{
    public class Command : IRequest<Result<Guid>>
    {
        public required Guid Id { get; set; }
    }

    public class Handler : IRequestHandler<Command, Result<Guid>>
    {
        private readonly IStorageService _storageService;
        private readonly IDataContext _dataContext;
        private readonly IUser _user;

        public Handler(IStorageService storageService, IDataContext dataContext, IUser user)
        {
            _storageService = storageService;
            _dataContext = dataContext;
            _user = user;
        }

        public async Task<Result<Guid>> Handle(Command request, CancellationToken cancellationToken)
        {
            var message = await _dataContext
                .Messages.Where(message =>
                    message.ImageId == request.Id && message.UserId == _user.Id
                )
                .SingleOrDefaultAsync(cancellationToken: cancellationToken);

            if (message == null)
            {
                return Result<Guid>.NotFound("Message not found");
            }

            var image = await _dataContext
                .Images.Where(image => image.Id == request.Id)
                .SingleOrDefaultAsync(cancellationToken: cancellationToken);

            if (image == null)
            {
                return Result<Guid>.NotFound("Image not found");
            }

            var deleteResult = await _storageService.Delete(image.StorageId);
            if (deleteResult != "OK")
            {
                return Result<Guid>.Failure(deleteResult);
            }

            message.Image = null;
            _dataContext.Images.Remove(image);

            try
            {
                await _dataContext.SaveChangesAsync(cancellationToken);
            }
            catch (Exception)
            {
                return Result<Guid>.Failure("Unable to delete the image");
            }

            return Result<Guid>.Success(request.Id);
        }
    }
}
