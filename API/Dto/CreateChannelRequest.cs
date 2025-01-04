namespace API.Dto;

public class CreateChannelRequest
{
    public required Guid WorkspaceId { get; set; }

    public required string Name { get; set; }
}
