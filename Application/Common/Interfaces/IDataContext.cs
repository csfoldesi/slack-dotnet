namespace Application.Common.Interfaces;

public interface IDataContext
{
    Task<int> SaveChangesAsync(CancellationToken cancellationToken);
}
