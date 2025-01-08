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

public class Update
{
    public class Command : IRequest<Result<ChannelDto>>
    {
        public required Guid ChannelId { get; set; }
        public string? Name { get; set; }
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
            var query = _dataContext
                .UserWorkspaces.Where(x =>
                    x.UserId == _user.Id && x.Role == WorkspaceRole.admin.ToString()
                )
                .SelectMany(x => x.Workspace!.Channels)
                .Where(x => x.Id == request.ChannelId);

            var channel = await query.SingleOrDefaultAsync(cancellationToken);

            if (channel == null)
            {
                return Result<ChannelDto>.Failure(
                    "Channel not found or user is not an admin member"
                );
            }

            channel.Name = string.IsNullOrWhiteSpace(request.Name)
                ? channel.Name
                : Regex.Replace(request.Name, @"\s+", "-").ToLower();

            var result = await _dataContext.SaveChangesAsync(cancellationToken);
            if (result == 0)
            {
                return Result<ChannelDto>.Failure("Unable to update the Channel");
            }

            return Result<ChannelDto>.Success(_mapper.Map<Channel, ChannelDto>(channel));
        }
    }
}
