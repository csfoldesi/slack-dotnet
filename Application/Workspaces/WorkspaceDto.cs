using Application.Channels;

namespace Application.Workspaces;

public class WorkspaceDto
{
    public Guid Id { get; set; }

    public required string Name { get; set; }

    public required string JoinCode { get; set; }

    public required List<ChannelDto> Channels { get; set; } = [];
}
