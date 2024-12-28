using Microsoft.AspNetCore.Identity;

namespace Domain;

public class User : IdentityUser
{
    public required string Name { get; set; }

    public string? Avatar { get; set; }
}
