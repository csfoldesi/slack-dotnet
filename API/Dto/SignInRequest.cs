﻿namespace API.Dto;

public class SignInRequest
{
    public required string Email { get; set; }

    public required string Password { get; set; }
}
