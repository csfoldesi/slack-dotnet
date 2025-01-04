using Application.Channels;
using Application.Members;
using Application.Workspaces;
using Domain;

namespace Application.Common;

public class MappingProfiles : AutoMapper.Profile
{
    public MappingProfiles()
    {
        CreateMap<Workspace, WorkspaceDto>();
        CreateMap<Channel, ChannelDto>();
        CreateMap<UserWorkspaces, MemberDto>()
            .ForMember(x => x.Name, ex => ex.MapFrom(u => u.User!.Name))
            .ForMember(x => x.Email, ex => ex.MapFrom(u => u.User!.Email))
            .ForMember(x => x.Avatar, ex => ex.MapFrom(u => u.User!.Avatar));
    }
}
