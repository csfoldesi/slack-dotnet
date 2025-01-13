﻿namespace Application.Channels;

public class ChannelDto
{
    public required Guid Id { get; set; }

    public required string Name { get; set; }

    public required DateTime CreatedAt { get; set; }
}
