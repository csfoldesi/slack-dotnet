using Application.Common;
using Application.Common.Interfaces;
using AutoMapper;
using Domain;
using Domain.Common;
using Domain.Interfaces;
using MediatR;

namespace Application.Workspaces;

public class Create
{
    public class Command : IRequest<Result<WorkspaceDto>>
    {
        public required string Name { get; set; }
    }

    public class Handler : IRequestHandler<Command, Result<WorkspaceDto>>
    {
        private readonly IDataContext _dataContext;
        private readonly IMapper _mapper;
        private readonly IUser _user;
        private static Random random = new Random();

        private static string GenerateCode(int length)
        {
            const string chars = "0123456789abcdefghijklmnopqrstuvwxyz";
            return new string(
                Enumerable.Repeat(chars, length).Select(s => s[random.Next(s.Length)]).ToArray()
            );
        }

        public Handler(IDataContext dataContext, IMapper mapper, IUser user)
        {
            _dataContext = dataContext;
            _mapper = mapper;
            _user = user;
        }

        public async Task<Result<WorkspaceDto>> Handle(
            Command request,
            CancellationToken cancellationToken
        )
        {
            var workspace = new Workspace
            {
                Id = Guid.NewGuid(),
                Name = request.Name,
                OwnerId = _user.Id!,
                JoinCode = GenerateCode(6),
            };
            _dataContext.Workspaces.Add(workspace);

            var member = new UserWorkspaces
            {
                UserId = _user.Id!,
                WorkspaceId = workspace.Id,
                Role = WorkspaceRole.admin.ToString(),
            };
            _dataContext.UserWorkspaces.Add(member);

            var channel = new Channel
            {
                Id = Guid.NewGuid(),
                Name = "general",
                Workspace = workspace,
            };
            _dataContext.Channels.Add(channel);

            var result = await _dataContext.SaveChangesAsync(cancellationToken);
            if (result == 0)
            {
                return Result<WorkspaceDto>.Failure("Unable to create the Workspace");
            }

            return Result<WorkspaceDto>.Success(_mapper.Map<Workspace, WorkspaceDto>(workspace));
        }
    }
}
