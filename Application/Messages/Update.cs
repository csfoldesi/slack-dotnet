using Application.Common;
using Application.Common.Interfaces;
using AutoMapper;
using Domain;
using Domain.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Messages;

public class Update
{
    public class Command : IRequest<Result<MessageDto>>
    {
        public required Guid Id { get; set; }
        public string? Body { get; set; }
        public Guid? ImageId { get; set; }
    }

    public class Handler : IRequestHandler<Command, Result<MessageDto>>
    {
        private readonly IDataContext _dataContext;
        private readonly IMapper _mapper;
        private readonly IUser _user;

        public Handler(IDataContext dataContext, IMapper mapper, IUser user)
        {
            _dataContext = dataContext;
            _mapper = mapper;
            _user = user;
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
                .SingleOrDefaultAsync(cancellationToken);

            if (message == null)
            {
                return Result<MessageDto>.NotFound();
            }

            message.Body = request.Body;
            message.ImageId = request.ImageId;
            message.UpdatedAt = DateTime.Now;

            try
            {
                await _dataContext.SaveChangesAsync(cancellationToken);
                return Result<MessageDto>.Success(_mapper.Map<Message, MessageDto>(message));
            }
            catch (Exception)
            {
                return Result<MessageDto>.Failure("Unable to save the Message");
            }
        }
    }
}
