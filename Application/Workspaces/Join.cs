using Application.Common;
using Application.Common.Interfaces;
using AutoMapper;
using Domain;
using Domain.Common;
using Domain.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Workspaces;

public class Join
{
    public class Command : IRequest<Result<WorkspaceDto>>
    {
        public required Guid WorkspaceId { get; set; }
        public required string JoinCode { get; set; }
    }

    public class Handler : IRequestHandler<Command, Result<WorkspaceDto>>
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

        public async Task<Result<WorkspaceDto>> Handle(
            Command request,
            CancellationToken cancellationToken
        )
        {
            var workspace = await _dataContext
                .Workspaces.Where(x => x.Id == request.WorkspaceId)
                .SingleOrDefaultAsync(cancellationToken);

            if (workspace == null)
            {
                return Result<WorkspaceDto>.NotFound("Workspace not found");
            }

            var membership = await _dataContext
                .Members.Where(x => x.UserId == _user.Id && x.WorkspaceId == request.WorkspaceId)
                .SingleOrDefaultAsync(cancellationToken);

            // already a member
            if (membership != null)
            {
                return Result<WorkspaceDto>.Success(
                    _mapper.Map<Workspace, WorkspaceDto>(workspace)
                );
            }

            // check Join Code
            if (workspace.JoinCode != request.JoinCode)
            {
                return Result<WorkspaceDto>.Failure("Incorrenct Join Code");
            }

            // add membership
            membership = new Member
            {
                UserId = _user.Id!,
                WorkspaceId = workspace.Id,
                Role = WorkspaceRole.member.ToString(),
            };
            _dataContext.Members.Add(membership);

            var result = await _dataContext.SaveChangesAsync(cancellationToken);
            if (result == 0)
            {
                return Result<WorkspaceDto>.Failure("Unable to join Workspace");
            }

            return Result<WorkspaceDto>.Success(_mapper.Map<Workspace, WorkspaceDto>(workspace));
        }
    }
}
