using Application.Common;
using Application.Common.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Domain.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Workspaces;

public class List
{
    public class Query : IRequest<Result<List<WorkspaceDto>>> { }

    public class Handler : IRequestHandler<Query, Result<List<WorkspaceDto>>>
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

        public async Task<Result<List<WorkspaceDto>>> Handle(
            Query request,
            CancellationToken cancellationToken
        )
        {
            var query = _dataContext
                .Members.Where(x => x.UserId == _user.Id)
                .Select(member => member.Workspace)
                .OrderBy(workspace => workspace!.Name)
                .ProjectTo<WorkspaceDto>(_mapper.ConfigurationProvider);

            var result = await query.ToListAsync(cancellationToken);

            return Result<List<WorkspaceDto>>.Success(result);
        }
    }
}
