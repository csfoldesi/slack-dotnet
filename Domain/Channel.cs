namespace Domain;

public class Channel
{
    public required Guid Id { get; set; }

    public required string Name { get; set; }

    public required Workspace Workspace { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.Now;
}
