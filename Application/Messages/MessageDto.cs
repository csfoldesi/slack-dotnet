﻿using Domain;

namespace Application.Messages;

public class MessageDto
{
    public Guid Id { get; set; }

    public string? Body { get; set; }

    public string? Image { get; set; }

    public required string AuthorId { get; set; }

    public required string AuthorName { get; set; }

    public required string AuthorAvatar { get; set; }

    public Guid WorkspaceId { get; set; }

    public Guid? ChannelId { get; set; }

    public Guid? ParentMessageId { get; set; }

    public Guid? ConversationId { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }
}
