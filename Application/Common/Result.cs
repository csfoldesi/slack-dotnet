namespace Application.Common;

public enum ResultCode
{
    Success,
    Error,
    NotFound,
}

public class Result<T>
{
    public T? Value { get; set; }

    public string? Error { get; set; }

    public bool HasValue
    {
        get => Value is not null;
    }

    public ResultCode ResultCode { get; set; }

    public static Result<T> Success(T? value) =>
        new() { ResultCode = ResultCode.Success, Value = value };

    public static Result<T> Failure(string? error) =>
        new() { ResultCode = ResultCode.Error, Error = error };

    public static Result<T> NotFound(string? error = null) =>
        new() { ResultCode = ResultCode.NotFound, Error = error };
}
