using Application.Common;
using Application.Common.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Domain.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Members;

public class GetMemberList
{
    public class Query : IRequest<Result<List<MemberDto>>>
    {
        public required Guid WorkspaceId { get; set; }
    }

    public class Handler : IRequestHandler<Query, Result<List<MemberDto>>>
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

        public async Task<Result<List<MemberDto>>> Handle(
            Query request,
            CancellationToken cancellationToken
        )
        {
            var isMember = await _dataContext.UserWorkspaces.AnyAsync(
                x => x.UserId == _user.Id && x.WorkspaceId == request.WorkspaceId,
                cancellationToken: cancellationToken
            );

            if (!isMember)
            {
                return Result<List<MemberDto>>.Success([]);
            }

            var query = _dataContext
                .UserWorkspaces.Where(x => x.WorkspaceId == request.WorkspaceId)
                .Include(x => x.User)
                .OrderBy(x => x.User!.Name)
                .ProjectTo<MemberDto>(_mapper.ConfigurationProvider);

            var result = await query.ToListAsync(cancellationToken);

            return Result<List<MemberDto>>.Success(result);
        }
    }
}
