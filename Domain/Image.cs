namespace Domain;

public class Image
{
    public Guid Id { get; set; }

    public required string StorageId { get; set; }

    public required string Url { get; set; }
}
