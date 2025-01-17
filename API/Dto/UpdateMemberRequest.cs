using System.Text.Json.Serialization;
using Domain.Common;

namespace API.Dto;

public class UpdateMemberRequest
{
    public Guid? WorkspaceId { get; set; }

    public required string UserId { get; set; }

    [JsonConverter(typeof(JsonStringEnumConverter))]
    public required WorkspaceRole Role { get; set; }
}
