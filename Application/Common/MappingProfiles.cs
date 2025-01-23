using Application.Channels;
using Application.Conversations;
using Application.Members;
using Application.Messages;
using Application.Workspaces;
using Domain;

namespace Application.Common;

public class MappingProfiles : AutoMapper.Profile
{
    public MappingProfiles()
    {
        CreateMap<Workspace, WorkspaceDto>();
        CreateMap<Channel, ChannelDto>();
        CreateMap<Member, MemberDto>()
            .ForMember(x => x.Name, ex => ex.MapFrom(u => u.User!.Name))
            .ForMember(x => x.Email, ex => ex.MapFrom(u => u.User!.Email))
            .ForMember(x => x.Avatar, ex => ex.MapFrom(u => u.User!.Avatar));
        CreateMap<Message, MessageDto>()
            .ForMember(x => x.AuthorId, ex => ex.MapFrom(m => m.UserId))
            .ForMember(x => x.AuthorName, ex => ex.MapFrom(m => m.User!.Name))
            .ForMember(x => x.AuthorAvatar, ex => ex.MapFrom(m => m.User!.Avatar))
            .ForMember(x => x.Image, ex => ex.MapFrom(i => i.Image != null ? i.Image.Url : null))
            .ForMember(
                x => x.Reactions,
                ex =>
                    ex.MapFrom(r =>
                        r.Reactions.GroupBy(r => r.Value)
                            .Select(g => new ReactionDto
                            {
                                Value = g.Key,
                                Count = g.Count(),
                                UserIds = g.Select(r => r.UserId!).ToList(),
                            })
                            .ToList()
                    )
            );
        CreateMap<Conversation, ConversationDto>();
    }
}
