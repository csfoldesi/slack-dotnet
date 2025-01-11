using Microsoft.EntityFrameworkCore;

namespace Application.Common;

public class PagedList<T>
{
    public IReadOnlyCollection<T> Items { get; }
    public int CurrentPage { get; }
    public int TotalPages { get; }
    public int PageSize { get; }
    public int TotalCount { get; }

    public PagedList(IReadOnlyCollection<T> items, int pageNumber, int totalCount, int pageSize)
    {
        Items = items;
        CurrentPage = pageNumber;
        TotalPages = (int)Math.Ceiling(totalCount / (double)pageSize);
        PageSize = pageSize;
        TotalCount = totalCount;
    }

    public static async Task<PagedList<T>> CreateAsync(
        IQueryable<T> source,
        int pageNumber,
        int pageSize
    )
    {
        var totalCount = await source.CountAsync();
        var items = await source.Skip(pageNumber * pageSize).Take(pageSize).ToListAsync();

        return new PagedList<T>(items, pageNumber, totalCount, pageSize);
    }
}
