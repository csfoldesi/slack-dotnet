using Application.Common;
using Application.Common.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Domain.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Messages;

public class List
{
    public class Query : IRequest<Result<PagedList<MessageDto>>>
    {
        public Guid? ChannelId { get; set; }
        public Guid? ConversationId { get; set; }
        public Guid? ParentMessageId { get; set; }
    }

    public class Handler : IRequestHandler<Query, Result<PagedList<MessageDto>>>
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

        public async Task<Result<PagedList<MessageDto>>> Handle(
            Query request,
            CancellationToken cancellationToken
        )
        {
            bool isMember = false;

            if (request.ChannelId != null)
            {
                isMember = await _dataContext
                    .Members.Where(member => member.UserId == _user.Id)
                    .SelectMany(member =>
                        member.Workspace!.Channels.Where(channel => channel.Id == request.ChannelId)
                    )
                    .AnyAsync(cancellationToken);
            }
            else if (request.ConversationId != null)
            {
                isMember = await _dataContext
                    .Conversations.Where(conversation => conversation.Id == request.ConversationId)
                    .Where(conversation =>
                        (
                            conversation.MemberOne != null
                            && conversation.MemberOne.User!.Id == _user.Id
                        )
                        || (
                            conversation.MemberTwo != null
                            && conversation.MemberTwo.User!.Id == _user.Id
                        )
                    )
                    .AnyAsync(cancellationToken);
            }
            else if (request.ParentMessageId != null)
            {
                isMember = await _dataContext
                    .Members.Where(member => member.UserId == _user.Id)
                    .SelectMany(member =>
                        member.Workspace!.Messages.Where(message =>
                            message.Id == request.ParentMessageId
                        )
                    )
                    .AnyAsync(cancellationToken);
            }

            if (!isMember)
            {
                return Result<PagedList<MessageDto>>.Failure("No membership found");
            }

            var query = _dataContext
                .Messages.Where(message =>
                    message.ChannelId == request.ChannelId
                    && message.ConversationId == request.ConversationId
                    && message.ParentMessageId == request.ParentMessageId
                )
                .OrderByDescending(message => message.CreatedAt)
                .ProjectTo<MessageDto>(_mapper.ConfigurationProvider);

            var result = await query.PaginatedListAsync(0, 10);

            return Result<PagedList<MessageDto>>.Success(result);
        }
    }
}
