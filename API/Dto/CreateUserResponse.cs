namespace API.Dto;

public class CreateUserResponse
{
    public required string Name { get; set; }

    public required string Email { get; set; }

    public string? Avatar { get; set; }

    public string? AccessToken { get; set; }
}
