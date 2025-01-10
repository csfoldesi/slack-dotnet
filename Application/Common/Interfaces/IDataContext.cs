﻿using Domain;
using Microsoft.EntityFrameworkCore;

namespace Application.Common.Interfaces;

public interface IDataContext
{
    public DbSet<RefreshToken> RefreshTokens { get; set; }

    public DbSet<Workspace> Workspaces { get; set; }

    public DbSet<Member> Members { get; set; }

    public DbSet<Channel> Channels { get; set; }

    public DbSet<Message> Messages { get; set; }

    public DbSet<Conversation> Conversations { get; set; }

    Task<int> SaveChangesAsync(CancellationToken cancellationToken);
}
