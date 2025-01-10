using Application.Common;
using Application.Common.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Domain.Common;
using Domain.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Workspaces;

public class Get
{
    public class Query : IRequest<Result<WorkspaceDto>>
    {
        public required Guid WorkspaceId { get; set; }
    }

    public class Handler : IRequestHandler<Query, Result<WorkspaceDto>>
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
            Query request,
            CancellationToken cancellationToken
        )
        {
            var query = _dataContext
                .Workspaces.Where(x => x.Id == request.WorkspaceId)
                .OrderBy(x => x!.Name)
                .ProjectTo<WorkspaceDto>(_mapper.ConfigurationProvider);

            var workspace = await query.SingleOrDefaultAsync(cancellationToken);
            if (workspace == null)
            {
                return Result<WorkspaceDto>.NotFound();
            }

            var membership = await _dataContext
                .Members.Where(x => x.UserId == _user.Id && x.WorkspaceId == request.WorkspaceId)
                .SingleOrDefaultAsync(cancellationToken);

            workspace.IsMember = membership != null;

            if (membership == null || membership.Role != WorkspaceRole.admin.ToString())
            {
                workspace.JoinCode = "";
            }

            return Result<WorkspaceDto>.Success(workspace);
        }
    }
}
