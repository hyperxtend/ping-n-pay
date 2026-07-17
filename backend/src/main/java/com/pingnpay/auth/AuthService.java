package com.pingnpay.auth;

import com.pingnpay.auth.dto.AuthResponse;
import com.pingnpay.auth.dto.LoginRequest;
import com.pingnpay.auth.dto.RegisterRequest;
import com.pingnpay.domain.organisation.Organisation;
import com.pingnpay.domain.organisation.OrganisationRepository;
import com.pingnpay.domain.user.Role;
import com.pingnpay.domain.user.User;
import com.pingnpay.domain.user.UserRepository;
import com.pingnpay.user.dto.UserResponse;
import jakarta.persistence.EntityExistsException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final OrganisationRepository organisationRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    /**
     * Register the first user for a new organisation.
     * The registering user is automatically assigned the ADMIN role.
     */
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.email())) {
            throw new EntityExistsException("An account with this email already exists");
        }

        Organisation organisation = organisationRepository.save(
                Organisation.builder()
                        .name(request.organisationName())
                        .build()
        );

        User user = userRepository.save(
                User.builder()
                        .firstName(request.firstName())
                        .lastName(request.lastName())
                        .email(request.email())
                        .passwordHash(passwordEncoder.encode(request.password()))
                        .role(Role.ADMIN)
                        .organisation(organisation)
                        .build()
        );

        return buildAuthResponse(user);
    }

    /**
     * Authenticate with email and password, return JWT tokens.
     */
    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.email(), request.password())
        );

        User user = userRepository.findByEmail(request.email())
                .orElseThrow(() -> new IllegalStateException("User not found after authentication"));

        return buildAuthResponse(user);
    }

    private AuthResponse buildAuthResponse(User user) {
        String accessToken = jwtService.generateAccessToken(user);
        String refreshToken = jwtService.generateRefreshToken(user);
        return AuthResponse.of(accessToken, refreshToken, UserResponse.from(user));
    }
}
