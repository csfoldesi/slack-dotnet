﻿namespace API.Dto;

public class CreateMessageRequest
{
    public required string Body { get; set; }

    public Guid? ImageId { get; set; }

    public required Guid WorkspaceId { get; set; }

    public Guid? ChannelId { get; set; }

    public Guid? ParentMessageId { get; set; }

    public Guid? ConversationId { get; set; }
}
