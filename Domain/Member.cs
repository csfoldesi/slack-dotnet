using Domain.Common;

namespace Domain;

public class Member
{
    public Guid Id { get; set; }

    public required string UserId { get; set; }

    public User? User { get; set; }

    public required Guid WorkspaceId { get; set; }

    public Workspace? Workspace { get; set; }

    public string Role { get; set; } = WorkspaceRole.member.ToString();
}
