namespace API.Dto;

public class CreateUserRequest
{
    public required string Name { get; set; }

    public required string Email { get; set; }

    public string? Password { get; set; }

    public string? Avatar { get; set; }
}
