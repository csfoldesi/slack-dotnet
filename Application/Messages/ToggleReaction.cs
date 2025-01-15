using Application.Common;
using Application.Common.Interfaces;
using Domain;
using Domain.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Messages;

public class ToggleReaction
{
    public class Command : IRequest<Result<string>>
    {
        public required Guid MessageId { get; set; }
        public required string Value { get; set; }
    }

    public class Handler : IRequestHandler<Command, Result<string>>
    {
        private readonly IDataContext _dataContext;
        private readonly IUser _user;

        public Handler(IDataContext dataContext, IUser user)
        {
            _dataContext = dataContext;
            _user = user;
        }

        public async Task<Result<string>> Handle(
            Command request,
            CancellationToken cancellationToken
        )
        {
            var message = await _dataContext
                .Members.Where(member => member.UserId == _user.Id)
                .SelectMany(member => member.Workspace!.Messages)
                .Where(message => message.Id == request.MessageId)
                .Include(message => message.Reactions)
                .ThenInclude(reaction => reaction.User)
                .SingleOrDefaultAsync(cancellationToken);

            if (message == null)
            {
                return Result<string>.NotFound();
            }

            var reaction = message.Reactions!.SingleOrDefault(reaction =>
                reaction.UserId == _user.Id && reaction.Value == request.Value
            );
            if (reaction == null)
            {
                reaction = new Reaction
                {
                    Id = Guid.NewGuid(),
                    Message = message,
                    UserId = _user.Id,
                    Value = request.Value,
                };
                _dataContext.Reactions.Add(reaction);
            }
            else
            {
                _dataContext.Reactions.Remove(reaction);
            }

            try
            {
                await _dataContext.SaveChangesAsync(cancellationToken);
                return Result<string>.Success(request.Value);
            }
            catch (Exception)
            {
                return Result<string>.Failure("Unable to toggle reaction");
            }
        }
    }
}
