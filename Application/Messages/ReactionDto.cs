namespace Application.Messages;

public class ReactionDto
{
    public required string Value { get; set; }

    public int Count { get; set; } = 0;

    public List<string> UserIds { get; set; } = [];
}
