using Application.Common;
using Application.Common.Interfaces;
using AutoMapper;
using Domain;
using Domain.Common;
using Domain.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Members;

public class Delete
{
    public class Command : IRequest<Result<MemberDto>>
    {
        public required Guid WorkspaceId { get; set; }
        public required string UserId { get; set; }
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
            var currentMember = await _dataContext
                .Members.Where(x => x.UserId == _user.Id && x.WorkspaceId == request.WorkspaceId)
                .SingleOrDefaultAsync(cancellationToken: cancellationToken);
            if (
                currentMember == null
                || (
                    currentMember.Role != WorkspaceRole.admin.ToString()
                    && _user.Id != request.UserId
                )
            )
            {
                return Result<MemberDto>.Unauthorized();
            }

            var memberToDelete = await _dataContext
                .Members.Where(x =>
                    x.WorkspaceId == request.WorkspaceId && x.UserId == request.UserId
                )
                .Include(x => x.User)
                .FirstOrDefaultAsync(cancellationToken: cancellationToken);
            if (memberToDelete == null)
            {
                return Result<MemberDto>.NotFound();
            }

            if (memberToDelete.Role == WorkspaceRole.admin.ToString())
            {
                var adminRemained = await _dataContext.Members.AnyAsync(
                    x =>
                        x.WorkspaceId == request.WorkspaceId
                        && x.Role == WorkspaceRole.admin.ToString()
                        && x.UserId != request.UserId,
                    cancellationToken: cancellationToken
                );
                if (!adminRemained)
                {
                    return Result<MemberDto>.Failure("At least one admin member must remain");
                }
            }

            _dataContext.Members.Remove(memberToDelete);

            try
            {
                await _dataContext.SaveChangesAsync(cancellationToken);
                return Result<MemberDto>.Success(_mapper.Map<Member, MemberDto>(memberToDelete));
            }
            catch (Exception)
            {
                return Result<MemberDto>.Failure("Unable to delete the member");
            }
        }
    }
}
