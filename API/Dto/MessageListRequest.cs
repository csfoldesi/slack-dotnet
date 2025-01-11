namespace API.Dto;

public class MessageListRequest
{
    public Guid? ChannelId { get; set; }
    public Guid? ConversationId { get; set; }
    public Guid? ParentMessageId { get; set; }
}
