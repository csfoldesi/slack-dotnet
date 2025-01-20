using Application.Common;

namespace API.Dto;

public class MessageListRequest : PagedQuery
{
    public Guid? ChannelId { get; set; }
    public Guid? ConversationId { get; set; }
    public Guid? ParentMessageId { get; set; }
}
