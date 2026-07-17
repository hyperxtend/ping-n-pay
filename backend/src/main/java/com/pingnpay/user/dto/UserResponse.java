package com.pingnpay.user.dto;

import com.pingnpay.domain.user.Role;
import com.pingnpay.domain.user.User;

import java.util.UUID;

public record UserResponse(
        UUID id,
        String email,
        String firstName,
        String lastName,
        Role role,
        UUID organisationId,
        String organisationName
) {
    public static UserResponse from(User user) {
        return new UserResponse(
                user.getId(),
                user.getEmail(),
                user.getFirstName(),
                user.getLastName(),
                user.getRole(),
                user.getOrganisation().getId(),
                user.getOrganisation().getName()
        );
    }
}
