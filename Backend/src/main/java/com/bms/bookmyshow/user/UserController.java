package com.bms.bookmyshow.user;

import com.bms.bookmyshow.common.ResourceNotFoundException;
import com.bms.bookmyshow.security.SecurityDto;
import com.bms.bookmyshow.security.TokenService;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.security.Principal;

@RestController
@RequestMapping("/api")
public class UserController {

    private final UserRepository repository;
    private final AuthenticationManager authenticationManager;
    private final PasswordEncoder encoder;
    private final TokenService tokenService;
    private final JwtDecoder decoder;

    public UserController(UserRepository repository, AuthenticationManager manager, PasswordEncoder encoder, TokenService tokenService, JwtDecoder decoder) {
        this.repository = repository;
        this.authenticationManager = manager;
        this.encoder = encoder;
        this.tokenService = tokenService;
        this.decoder = decoder;
    }

    @PostMapping("/auth/login")
    public SecurityDto.TokenResponse login(@RequestBody SecurityDto.Login request)
    {
        Authentication authentication = authenticationManager.authenticate(
                UsernamePasswordAuthenticationToken
                        .unauthenticated(request.email().toLowerCase(), request.password()));

        return new SecurityDto.TokenResponse(tokenService.create(authentication), "Bearer", tokenService.expiresInSeconds());
    }

    @PostMapping("/auth/register")
    @ResponseStatus(HttpStatus.CREATED)
    public SecurityDto.TokenResponse register(@RequestBody SecurityDto.Register request){
        if(repository.existsByEmail(request.email().toLowerCase())){
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email is already registered");
        }

        User user = new User();
        user.setEmail(request.email().toLowerCase());
        user.setName(request.name());
        user.setPassword(encoder.encode(request.password()));
        user.setPhone(request.phone());

        User savedUser = repository.save(user);
        Authentication authentication = authenticationManager.authenticate(
                UsernamePasswordAuthenticationToken
                        .unauthenticated(
                                request.email().toLowerCase(), request.password()
                        )
        );

        return new SecurityDto.TokenResponse(
                tokenService.create(authentication),
                "Bearer",
                tokenService.expiresInSeconds()
        );

    }

    @GetMapping("/profile")
    public UserDto.ProfileResponse profile(Principal principal){
        User user = repository.findByEmail(principal.getName())
                .orElseThrow(()->new ResourceNotFoundException("User not found"));

        return UserDto.ProfileResponse.from(user);
    }
}
