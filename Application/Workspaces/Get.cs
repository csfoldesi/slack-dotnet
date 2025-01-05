﻿using Application.Common;
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
                .UserWorkspaces.Where(x => x.WorkspaceId == request.WorkspaceId)
                .Select(x => x.Workspace)
                .OrderBy(x => x!.Name)
                .ProjectTo<WorkspaceDto>(_mapper.ConfigurationProvider);

            var result = await query.FirstOrDefaultAsync(cancellationToken);
            if (result == null)
            {
                return Result<WorkspaceDto>.NotFound();
            }

            var isAdminMember = await _dataContext
                .UserWorkspaces.Where(x =>
                    x.UserId == _user.Id
                    && x.WorkspaceId == request.WorkspaceId
                    && x.Role == WorkspaceRole.admin.ToString()
                )
                .AnyAsync(cancellationToken: cancellationToken);
            if (!isAdminMember)
            {
                result.JoinCode = "";
                result.Channels = [];
            }

            return Result<WorkspaceDto>.Success(result);
        }
    }
}
