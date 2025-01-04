using Application.Common.Interfaces;
using Domain;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Persistence;

public class DataContext : IdentityDbContext<User>, IDataContext
{
    public DbSet<RefreshToken> RefreshTokens { get; set; }

    public DbSet<Workspace> Workspaces { get; set; }

    public DbSet<UserWorkspaces> UserWorkspaces { get; set; }

    public DbSet<Channel> Channels { get; set; }

    public DataContext(DbContextOptions options)
        : base(options) { }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        builder.Entity<UserWorkspaces>(x => x.HasKey(uw => new { uw.UserId, uw.WorkspaceId }));
        builder
            .Entity<UserWorkspaces>()
            .HasOne(uw => uw.User)
            .WithMany(u => u.Workspaces)
            .HasForeignKey(u => u.UserId);
        builder
            .Entity<UserWorkspaces>()
            .HasOne(uw => uw.Workspace)
            .WithMany(w => w.UserWorkspaces)
            .HasForeignKey(w => w.WorkspaceId);

        // Configure cascade delete for Workspace -> Channels relationship
        builder
            .Entity<Workspace>()
            .HasMany(w => w.Channels)
            .WithOne(c => c.Workspace)
            .OnDelete(DeleteBehavior.Cascade);

        // Configure cascade delete for Workspace -> UserWorkspaces relationship
        builder
            .Entity<Workspace>()
            .HasMany(w => w.UserWorkspaces)
            .WithOne(uw => uw.Workspace)
            .OnDelete(DeleteBehavior.Cascade);

        // Ensure UserWorkspaces relationship to User does not cascade delete Users
        builder
            .Entity<UserWorkspaces>()
            .HasOne(uw => uw.User)
            .WithMany()
            .OnDelete(DeleteBehavior.Restrict);
    }
}
