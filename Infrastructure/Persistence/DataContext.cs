using Application.Common.Interfaces;
using Domain;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Persistence;

public class DataContext : IdentityDbContext<User>, IDataContext
{
    public DbSet<RefreshToken> RefreshTokens { get; set; }

    public DbSet<Workspace> Workspaces { get; set; }

    public DbSet<Member> Members { get; set; }

    public DbSet<Channel> Channels { get; set; }

    public DbSet<Message> Messages { get; set; }

    public DbSet<Conversation> Conversations { get; set; }

    public DbSet<Reaction> Reactions { get; set; }

    public DataContext(DbContextOptions options)
        : base(options) { }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        // set IDs NOCASE
        builder.Entity<RefreshToken>().Property(x => x.Id).HasColumnType("TEXT COLLATE NOCASE");
        builder.Entity<Workspace>().Property(x => x.Id).HasColumnType("TEXT COLLATE NOCASE");
        builder.Entity<Member>().Property(x => x.Id).HasColumnType("TEXT COLLATE NOCASE");
        builder.Entity<Channel>().Property(x => x.Id).HasColumnType("TEXT COLLATE NOCASE");
        builder.Entity<Message>().Property(x => x.Id).HasColumnType("TEXT COLLATE NOCASE");
        builder.Entity<Conversation>().Property(x => x.Id).HasColumnType("TEXT COLLATE NOCASE");
        builder.Entity<Reaction>().Property(x => x.Id).HasColumnType("TEXT COLLATE NOCASE");

        builder
            .Entity<Conversation>()
            .HasIndex(c => new
            {
                c.WorkspaceId,
                c.UserOneId,
                c.UserTwoId,
            })
            .IsUnique();
        builder
            .Entity<Conversation>()
            .HasOne(c => c.Workspace)
            .WithMany()
            .HasForeignKey(c => c.WorkspaceId);
        builder
            .Entity<Conversation>()
            .HasOne(c => c.UserOne)
            .WithMany()
            .HasForeignKey(c => c.UserOneId);
        builder
            .Entity<Conversation>()
            .HasOne(c => c.UserTwo)
            .WithMany()
            .HasForeignKey(c => c.UserTwoId);

        //builder.Entity<Member>(x => x.HasKey(uw => new { uw.UserId, uw.WorkspaceId }));
        builder
            .Entity<Member>()
            .HasOne(uw => uw.User)
            .WithMany(u => u.Workspaces)
            .HasForeignKey(u => u.UserId);
        builder
            .Entity<Member>()
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
        /*builder
            .Entity<UserWorkspaces>()
            .HasOne(uw => uw.User)
            .WithMany()
            .OnDelete(DeleteBehavior.Restrict);*/
    }
}
