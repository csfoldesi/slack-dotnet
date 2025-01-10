namespace Domain;

public class Conversation
{
    public Guid Id { get; set; }

    public required Member MemberOne { get; set; }

    public required Member MemberTwo { get; set; }
}
