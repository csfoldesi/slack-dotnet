using Application.Common;
using Application.Common.Interfaces;
using AutoMapper;
using Domain;
using Domain.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Messages;

public class Create
{
    public class Command : IRequest<Result<MessageDto>>
    {
        public string? Body { get; set; }

        public Guid? ImageId { get; set; }

        public required Guid WorkspaceId { get; set; }

        public Guid? ChannelId { get; set; }

        public Guid? ParentMessageId { get; set; }

        public Guid? ConversationId { get; set; }
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
            var member = await _dataContext.Members.FirstOrDefaultAsync(
                x => x.UserId == _user.Id && x.WorkspaceId == request.WorkspaceId,
                cancellationToken: cancellationToken
            );

            if (member == null)
            {
                return Result<MessageDto>.NotFound();
            }

            var workspace = await _dataContext
                .Members.Where(x => x.WorkspaceId == request.WorkspaceId)
                .Where(x => x.UserId == _user.Id)
                .Select(x => x.Workspace)
                .SingleOrDefaultAsync(cancellationToken: cancellationToken);
            if (workspace == null)
            {
                return Result<MessageDto>.NotFound("Workspace not found");
            }

            var message = new Message
            {
                Id = Guid.NewGuid(),
                UserId = _user.Id,
                Body = request.Body,
                ImageId = request.ImageId,
                Workspace = workspace,
                ChannelId = request.ChannelId,
                ParentMessageId = request.ParentMessageId,
                ConversationId = request.ConversationId,
            };

            _dataContext.Messages.Add(message);
            try
            {
                await _dataContext.SaveChangesAsync(cancellationToken);
                return Result<MessageDto>.Success(_mapper.Map<Message, MessageDto>(message));
            }
            catch (Exception)
            {
                return Result<MessageDto>.Failure("Unable to create the Message");
            }
        }
    }
}
