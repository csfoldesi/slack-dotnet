namespace API.Dto;

public class UserProfile
{
    public required string Id { get; set; }

    public required string Name { get; set; }

    public required string Email { get; set; }

    public string? Avatar { get; set; }
}
