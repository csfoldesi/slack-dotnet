using Application.Common;
using Application.Common.Interfaces;
using AutoMapper;
using Domain;
using Domain.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Channels;

public class Get
{
    public class Query : IRequest<Result<ChannelDto>>
    {
        public Guid ChannelId { get; set; }
    }

    public class Handler : IRequestHandler<Query, Result<ChannelDto>>
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

        public async Task<Result<ChannelDto>> Handle(
            Query request,
            CancellationToken cancellationToken
        )
        {
            var query = _dataContext
                .Members.Where(x => x.UserId == _user.Id)
                .SelectMany(x => x.Workspace!.Channels)
                .Where(x => x.Id == request.ChannelId);

            var channel = await query.SingleOrDefaultAsync(cancellationToken);

            if (channel == null)
            {
                return Result<ChannelDto>.NotFound();
            }

            return Result<ChannelDto>.Success(_mapper.Map<Channel, ChannelDto>(channel));
        }
    }
}
