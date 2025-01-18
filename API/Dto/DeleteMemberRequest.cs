namespace API.Dto;

public class DeleteMemberRequest
{
    public Guid? WorkspaceId { get; set; }

    public required string UserId { get; set; }
}
