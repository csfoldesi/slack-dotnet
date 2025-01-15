namespace Domain;

public class Reaction
{
    public Guid Id { get; set; }

    public required Message Message { get; set; }

    public User? User { get; set; }
    public string? UserId { get; set; }

    public required string Value { get; set; }
}
