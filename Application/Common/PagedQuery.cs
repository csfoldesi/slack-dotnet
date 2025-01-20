namespace Application.Common;

public class PagedQuery
{
    private const int MaxPageSize = 50;

    public int PageNumber { get; set; } = 0;

    private int _pageSize = 10;
    public int PageSize
    {
        get => _pageSize;
        set => _pageSize = Math.Min(value, MaxPageSize);
    }
}
