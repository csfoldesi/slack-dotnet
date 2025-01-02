namespace Domain;

public class Workspace
{
    public required Guid Id { get; set; }

    public required string Name { get; set; }

    public required string OwnerId { get; set; }

    public required string JoinCode { get; set; }

    public ICollection<UserWorkspaces> UserWorkspaces { get; set; } = [];
}
