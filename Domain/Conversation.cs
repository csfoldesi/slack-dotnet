namespace Domain;

public class Conversation
{
    public Guid Id { get; set; }

    public Workspace? Workspace { get; set; }

    public Guid? WorkspaceId { get; set; }

    public required User UserOne { get; set; }

    public string? UserOneId { get; set; }

    public required User UserTwo { get; set; }

    public string? UserTwoId { get; set; }
}
