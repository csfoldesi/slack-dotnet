namespace API.Dto;

public class ApiResponse<T>
{
    public bool IsSuccess { get; set; }

    public T? Data { get; set; }

    public string? ErrorMessage { get; set; }

    public static ApiResponse<T> Success(T? data) => new() { IsSuccess = true, Data = data };

    public static ApiResponse<T> Failure(string? errorMessage) =>
        new() { IsSuccess = false, ErrorMessage = errorMessage };
}
