using Microsoft.EntityFrameworkCore;

namespace Application.Common;

public static class MappingExtensions
{
    public static Task<PagedList<TDestination>> PaginatedListAsync<TDestination>(
        this IQueryable<TDestination> queryable,
        int pageNumber,
        int pageSize
    )
        where TDestination : class =>
        PagedList<TDestination>.CreateAsync(queryable.AsNoTracking(), pageNumber, pageSize);
}
