using Application.Common;
using Application.Common.Interfaces;
using AutoMapper;
using Domain;
using Domain.Common;
using Domain.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Workspaces;

public class NewJoinCode
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
            var workspace = await _dataContext
                .Members.Where(x => x.WorkspaceId == request.WorkspaceId)
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

            workspace.JoinCode = GenerateCode(6);

            var result = await _dataContext.SaveChangesAsync(cancellationToken);
            if (result == 0)
            {
                return Result<WorkspaceDto>.Failure("Unable to generate new Join Code");
            }

            return Result<WorkspaceDto>.Success(_mapper.Map<Workspace, WorkspaceDto>(workspace));
        }
    }
}
