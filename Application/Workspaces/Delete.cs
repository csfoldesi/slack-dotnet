using Application.Common;
using Application.Common.Interfaces;
using AutoMapper;
using Domain;
using Domain.Common;
using Domain.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Workspaces;

public class Delete
{
    public class Command : IRequest<Result<WorkspaceDto>>
    {
        public required Guid WorkspaceId { get; set; }
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
                .UserWorkspaces.Where(x => x.WorkspaceId == request.WorkspaceId)
                .Where(x => x.UserId == _user.Id)
                .Where(x => x.Role == WorkspaceRole.admin.ToString())
                .Select(x => x.Workspace)
                .SingleOrDefaultAsync(cancellationToken: cancellationToken);
            if (workspace == null)
            {
                return Result<WorkspaceDto>.Failure(
                    "Workspace not found or user is not an admin member"
                );
            }

            _dataContext.Workspaces.Remove(workspace);

            var result = await _dataContext.SaveChangesAsync(cancellationToken);
            if (result == 0)
            {
                return Result<WorkspaceDto>.Failure("Unable to delete the workspace");
            }

            return Result<WorkspaceDto>.Success(_mapper.Map<Workspace, WorkspaceDto>(workspace));
        }
    }
}
