using Domain;
using Microsoft.EntityFrameworkCore;

namespace Application.Common.Interfaces;

public interface IDataContext
{
    public DbSet<RefreshToken> RefreshTokens { get; set; }

    public DbSet<Workspace> Workspaces { get; set; }

    public DbSet<UserWorkspaces> UserWorkspaces { get; set; }

    public DbSet<Channel> Channels { get; set; }

    Task<int> SaveChangesAsync(CancellationToken cancellationToken);
}
