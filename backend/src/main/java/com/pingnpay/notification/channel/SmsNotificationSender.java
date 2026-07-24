package com.pingnpay.notification.channel;

import com.pingnpay.domain.notification.Notification;
import com.pingnpay.domain.notification.NotificationChannel;
import com.pingnpay.domain.notification.NotificationRepository;
import com.pingnpay.domain.notification.NotificationStatus;
import com.twilio.rest.api.v2010.account.Message;
import com.twilio.type.PhoneNumber;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import java.time.Instant;

@Component
@RequiredArgsConstructor
@Slf4j
public class SmsNotificationSender implements NotificationSender {

    private final NotificationRepository notificationRepository;

    @Value("${app.twilio.from-number:}")
    private String fromNumber;

    @Override
    public NotificationChannel channel() {
        return NotificationChannel.SMS;
    }

    @Override
    public void send(Notification notification) {
        if (!StringUtils.hasText(notification.getRecipient())) {
            notification.setStatus(NotificationStatus.SKIPPED);
            notification.setErrorMessage("No phone number on record for this client");
            notificationRepository.save(notification);
            return;
        }

        try {
            var invoice = notification.getInvoice();
            String body = "Ping 'n Pay: Invoice %s for %s %,.2f is %s. Please arrange payment. Reply STOP to opt out."
                    .formatted(
                            invoice.getNumber(),
                            invoice.getCurrency(),
                            invoice.getTotal(),
                            invoice.getStatus().name().toLowerCase()
                    );

            Message.creator(
                    new PhoneNumber(notification.getRecipient()),
                    new PhoneNumber(fromNumber),
                    body
            ).create();

            notification.setStatus(NotificationStatus.SENT);
            notification.setSentAt(Instant.now());
            log.info("SMS sent for invoice {} to {}", invoice.getNumber(), notification.getRecipient());

        } catch (Exception e) {
            notification.setStatus(NotificationStatus.FAILED);
            notification.setErrorMessage(e.getMessage());
            log.error("Failed to send SMS for invoice {}: {}", notification.getInvoice().getNumber(), e.getMessage());
        }

        notificationRepository.save(notification);
    }
}
