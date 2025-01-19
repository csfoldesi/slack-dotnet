using Application.Common;
using Application.Common.Interfaces;
using AutoMapper;
using Domain;
using Domain.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Conversations;

public class CreateOrGet
{
    public class Command : IRequest<Result<ConversationDto>>
    {
        public required Guid WorkspaceId { get; set; }

        public string? UserId { get; set; }
    }

    public class Handler : IRequestHandler<Command, Result<ConversationDto>>
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

        public async Task<Result<ConversationDto>> Handle(
            Command request,
            CancellationToken cancellationToken
        )
        {
            var user = await _dataContext
                .Members.Where(x => x.UserId == _user.Id && x.WorkspaceId == request.WorkspaceId)
                .Select(m => m.User)
                .SingleOrDefaultAsync(cancellationToken: cancellationToken);
            if (user == null)
            {
                return Result<ConversationDto>.Unauthorized();
            }

            var otherUser = await _dataContext
                .Members.Where(x =>
                    x.UserId == request.UserId && x.WorkspaceId == request.WorkspaceId
                )
                .Select(m => m.User)
                .SingleOrDefaultAsync(cancellationToken: cancellationToken);
            if (otherUser == null)
            {
                return Result<ConversationDto>.NotFound("User not found");
            }

            var conversation = await _dataContext
                .Conversations.Where(x => x.WorkspaceId == request.WorkspaceId)
                .Where(x =>
                    (x.UserOne.Id == _user.Id && x.UserTwo.Id == request.UserId)
                    || (x.UserOne.Id == request.UserId && x.UserTwo.Id == _user.Id)
                )
                .SingleOrDefaultAsync(cancellationToken: cancellationToken);

            if (conversation != null)
            {
                return Result<ConversationDto>.Success(
                    _mapper.Map<Conversation, ConversationDto>(conversation)
                );
            }

            conversation = new Conversation
            {
                Id = Guid.NewGuid(),
                WorkspaceId = request.WorkspaceId,
                UserOne = user,
                UserTwo = otherUser,
            };

            _dataContext.Conversations.Add(conversation);
            try
            {
                await _dataContext.SaveChangesAsync(cancellationToken);
                return Result<ConversationDto>.Success(
                    _mapper.Map<Conversation, ConversationDto>(conversation)
                );
            }
            catch (Exception)
            {
                return Result<ConversationDto>.Failure("Unable to create the Conversation");
            }
        }
    }
}
