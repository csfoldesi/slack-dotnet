using Application.Common;
using Application.Common.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Domain;
using Domain.Common;
using Domain.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Members;

public class Update
{
    public class Command : IRequest<Result<MemberDto>>
    {
        public required Guid WorkspaceId { get; set; }
        public required string UserId { get; set; }
        public required WorkspaceRole Role { get; set; }
    }

    public class Handler : IRequestHandler<Command, Result<MemberDto>>
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
            Command request,
            CancellationToken cancellationToken
        )
        {
            var isAdminMember = await _dataContext.Members.AnyAsync(
                x =>
                    x.UserId == _user.Id
                    && x.WorkspaceId == request.WorkspaceId
                    && x.Role == WorkspaceRole.admin.ToString(),
                cancellationToken: cancellationToken
            );
            if (!isAdminMember)
            {
                return Result<MemberDto>.Unauthorized();
            }

            var member = await _dataContext
                .Members.Where(x =>
                    x.WorkspaceId == request.WorkspaceId && x.UserId == request.UserId
                )
                .Include(x => x.User)
                .FirstOrDefaultAsync(cancellationToken: cancellationToken);
            if (member == null)
            {
                return Result<MemberDto>.NotFound();
            }

            member.Role = request.Role.ToString();

            try
            {
                await _dataContext.SaveChangesAsync(cancellationToken);
                return Result<MemberDto>.Success(_mapper.Map<Member, MemberDto>(member));
            }
            catch (Exception)
            {
                return Result<MemberDto>.Failure("Unable to update teh role");
            }
        }
    }
}
