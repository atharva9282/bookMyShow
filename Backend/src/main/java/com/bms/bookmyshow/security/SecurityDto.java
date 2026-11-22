package com.bms.bookmyshow.security;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public class SecurityDto {

    public record TokenResponse(
            String accessToken,
            String tokenType,
            long expireInSeconds
    ){}

    public record Register(
            @NotBlank @Size(max = 100) String name,
            @NotBlank @Email String email,
            @NotBlank String phone,
            @NotBlank String password

    ){}

    public record Login(
            @NotBlank @Email String email,
            @NotBlank String password
    ){}
}