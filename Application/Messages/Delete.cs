using Application.Common;
using Application.Common.Interfaces;
using AutoMapper;
using Domain;
using Domain.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Messages;

public class Delete
{
    public class Command : IRequest<Result<MessageDto>>
    {
        public required Guid Id { get; set; }
    }

    public class Handler : IRequestHandler<Command, Result<MessageDto>>
    {
        private readonly IDataContext _dataContext;
        private readonly IStorageService _storageService;
        private readonly IMapper _mapper;
        private readonly IUser _user;

        public Handler(
            IDataContext dataContext,
            IMapper mapper,
            IUser user,
            IStorageService storageService
        )
        {
            _dataContext = dataContext;
            _mapper = mapper;
            _user = user;
            _storageService = storageService;
        }

        public async Task<Result<MessageDto>> Handle(
            Command request,
            CancellationToken cancellationToken
        )
        {
            var message = await _dataContext
                .Members.Where(member => member.UserId == _user.Id)
                .SelectMany(member => member.Workspace!.Messages)
                .Where(message => message.UserId == _user.Id && message.Id == request.Id)
                .Include(message => message.Image)
                .SingleOrDefaultAsync(cancellationToken);

            if (message == null)
            {
                return Result<MessageDto>.NotFound();
            }

            if (message.Image != null)
            {
                await _storageService.Delete(message.Image.StorageId);
                _dataContext.Images.Remove(message.Image);
            }

            _dataContext.Messages.Remove(message);

            try
            {
                await _dataContext.SaveChangesAsync(cancellationToken);
                return Result<MessageDto>.Success(_mapper.Map<Message, MessageDto>(message));
            }
            catch (Exception)
            {
                return Result<MessageDto>.Failure("Unable to delete the message");
            }
        }
    }
}
