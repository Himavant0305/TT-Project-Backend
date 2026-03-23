package com.contactmgmt.service;

import com.contactmgmt.dto.AuthResponse;
import com.contactmgmt.dto.LoginRequest;
import com.contactmgmt.dto.RegisterRequest;
import com.contactmgmt.exception.DuplicateResourceException;
import com.contactmgmt.model.User;
import com.contactmgmt.repository.UserRepository;
import com.contactmgmt.security.CustomUserDetailsService;
import com.contactmgmt.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final CustomUserDetailsService userDetailsService;

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateResourceException("Email already registered");
        }
        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .build();
        userRepository.save(user);
        UserDetails userDetails = userDetailsService.loadUserByUsername(user.getId());
        String token = jwtService.generateToken(userDetails);
        return AuthResponse.builder()
                .token(token)
                .email(user.getEmail())
                .name(user.getName())
                .userId(user.getId())
                .build();
    }

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow();
        UserDetails userDetails = userDetailsService.loadUserByUsername(user.getId());
        String token = jwtService.generateToken(userDetails);
        return AuthResponse.builder()
                .token(token)
                .email(user.getEmail())
                .name(user.getName())
                .userId(user.getId())
                .build();
    }
}
