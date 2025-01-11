namespace Domain;

public class Message
{
    public Guid Id { get; set; }

    public required string Body { get; set; }

    public string? Image { get; set; }

    public required Member Member { get; set; }

    public Guid? MemberId { get; set; }

    public required Workspace Workspace { get; set; }

    public Guid? WorkspaceId { get; set; }

    public Channel? Channel { get; set; }

    public Guid? ChannelId { get; set; }

    public Message? ParentMessage { get; set; }

    public Guid? ParentMessageId { get; set; }

    public Conversation? Conversation { get; set; }

    public Guid? ConversationId { get; set; }

    public DateTime? CreatedAt { get; set; } = DateTime.Now;

    public DateTime? UpdatedAt { get; set; }
}
