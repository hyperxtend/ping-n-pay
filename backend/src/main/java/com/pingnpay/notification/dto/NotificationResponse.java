package com.pingnpay.notification.dto;

import com.pingnpay.domain.notification.Notification;
import com.pingnpay.domain.notification.NotificationChannel;
import com.pingnpay.domain.notification.NotificationStatus;

import java.time.Instant;
import java.util.UUID;

public record NotificationResponse(
        UUID id,
        UUID invoiceId,
        String invoiceNumber,
        String clientName,
        NotificationChannel channel,
        String recipient,
        NotificationStatus status,
        Instant scheduledAt,
        Instant sentAt,
        String errorMessage
) {
    public static NotificationResponse from(Notification n) {
        return new NotificationResponse(
                n.getId(),
                n.getInvoice().getId(),
                n.getInvoice().getNumber(),
                n.getInvoice().getClient().getName(),
                n.getChannel(),
                n.getRecipient(),
                n.getStatus(),
                n.getScheduledAt(),
                n.getSentAt(),
                n.getErrorMessage()
        );
    }
}
