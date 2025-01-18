using Application.Common;
using Application.Common.Interfaces;
using AutoMapper;
using Domain;
using Domain.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Messages;

public class Get
{
    public class Query : IRequest<Result<MessageDto>>
    {
        public required Guid MessageId { get; set; }
    }

    public class Handler : IRequestHandler<Query, Result<MessageDto>>
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
            Query request,
            CancellationToken cancellationToken
        )
        {
            var message = await _dataContext
                .Messages.Where(message => message.Id == request.MessageId)
                .Include(message => message.User)
                .Include(message => message.Reactions)
                .SingleOrDefaultAsync(cancellationToken: cancellationToken);

            if (message == null)
            {
                return Result<MessageDto>.NotFound();
            }

            var isMember = await _dataContext.Members.AnyAsync(
                m => m.UserId == _user.Id && m.WorkspaceId == message.WorkspaceId,
                cancellationToken: cancellationToken
            );

            if (!isMember)
            {
                return Result<MessageDto>.Unauthorized();
            }

            return Result<MessageDto>.Success(_mapper.Map<Message, MessageDto>(message));
        }
    }
}
