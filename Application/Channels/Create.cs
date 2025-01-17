using System.Text.RegularExpressions;
using Application.Common;
using Application.Common.Interfaces;
using AutoMapper;
using Domain;
using Domain.Common;
using Domain.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Channels;

public class Create
{
    public class Command : IRequest<Result<ChannelDto>>
    {
        public required Guid WorkspaceId { get; set; }
        public required string Name { get; set; }
    }

    public class Handler : IRequestHandler<Command, Result<ChannelDto>>
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

        public async Task<Result<ChannelDto>> Handle(
            Command request,
            CancellationToken cancellationToken
        )
        {
            var workspace = await _dataContext
                .Members.Where(x => x.WorkspaceId == request.WorkspaceId)
                .Where(x => x.UserId == _user.Id)
                .Where(x => x.Role == WorkspaceRole.admin.ToString())
                .Select(x => x.Workspace)
                .SingleOrDefaultAsync(cancellationToken: cancellationToken);
            if (workspace == null)
            {
                return Result<ChannelDto>.Failure(
                    "Workspace not found or user is not an admin member"
                );
            }

            var name = Regex.Replace(request.Name, @"\s+", "-").ToLower();
            var channel = new Channel
            {
                Id = Guid.NewGuid(),
                Name = name,
                Workspace = workspace,
            };

            _dataContext.Channels.Add(channel);

            var result = await _dataContext.SaveChangesAsync(cancellationToken);
            if (result == 0)
            {
                return Result<ChannelDto>.Failure("Unable to create the Channel");
            }

            return Result<ChannelDto>.Success(_mapper.Map<Channel, ChannelDto>(channel));
        }
    }
}
