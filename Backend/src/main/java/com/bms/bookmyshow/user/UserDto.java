package com.bms.bookmyshow.user;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public class UserDto {

    public record ProfileResponse(
            Long id,
            String name,
            String email,
            String phone
    ){
        public static ProfileResponse from(User user)
        {
            return new ProfileResponse(
                    user.getId(),
                    user.getName(),
                    user.getEmail(),
                    user.getPhone()
            );
        }
    }
}
