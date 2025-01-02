namespace Domain;

public class Workspace
{
    public Guid Id { get; set; }

    public required string Name { get; set; }

    public required string UserId { get; set; }

    public required string JoinCode { get; set; }
}
