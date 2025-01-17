using Application.Common;
using Application.Common.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Domain.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Members;

public class GetMember
{
    public class Query : IRequest<Result<MemberDto>>
    {
        public required Guid WorkspaceId { get; set; }

        public string? UserId { get; set; }
    }

    public class Handler : IRequestHandler<Query, Result<MemberDto>>
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

        public async Task<Result<MemberDto>> Handle(
            Query request,
            CancellationToken cancellationToken
        )
        {
            var isMember = await _dataContext.Members.AnyAsync(
                x => x.UserId == _user.Id && x.WorkspaceId == request.WorkspaceId,
                cancellationToken: cancellationToken
            );

            if (!isMember)
            {
                return Result<MemberDto>.NotFound();
            }

            var membership = await _dataContext
                .Members.Where(x =>
                    x.UserId == (request.UserId ?? _user.Id) && x.WorkspaceId == request.WorkspaceId
                )
                .Include(x => x.User)
                .ProjectTo<MemberDto>(_mapper.ConfigurationProvider)
                .FirstOrDefaultAsync(cancellationToken: cancellationToken);

            return membership != null
                ? Result<MemberDto>.Success(membership)
                : Result<MemberDto>.NotFound();
        }
    }
}
