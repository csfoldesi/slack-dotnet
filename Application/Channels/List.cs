﻿using Application.Common;
using Application.Common.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Domain.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Channels;

public class List
{
    public class Query : IRequest<Result<List<ChannelDto>>>
    {
        public Guid WorkspaceId { get; set; }
    }

    public class Handler : IRequestHandler<Query, Result<List<ChannelDto>>>
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

        public async Task<Result<List<ChannelDto>>> Handle(
            Query request,
            CancellationToken cancellationToken
        )
        {
            var query = _dataContext
                .UserWorkspaces.Where(x =>
                    x.UserId == _user.Id && x.WorkspaceId == request.WorkspaceId
                )
                .SelectMany(x => x.Workspace!.Channels)
                .ProjectTo<ChannelDto>(_mapper.ConfigurationProvider);

            var result = await query.ToListAsync(cancellationToken);

            return Result<List<ChannelDto>>.Success(result);
        }
    }
}
