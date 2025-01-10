namespace Domain;

public class Message
{
    public Guid Id { get; set; }

    public required string Body { get; set; }

    public string? Image { get; set; }

    public required Workspace Workspace { get; set; }

    public Channel? Channel { get; set; }

    public Message? ParentMessage { get; set; }

    public Conversation? Conversation { get; set; }

    public DateTime? UpdatedAt { get; set; }
}
