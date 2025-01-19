namespace API.Dto;

public class CreateConversationRequest
{
    public required Guid WorkspaceId { get; set; }

    public required string UserId { get; set; }
}
