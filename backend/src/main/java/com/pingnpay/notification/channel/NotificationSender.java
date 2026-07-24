package com.pingnpay.notification.channel;

import com.pingnpay.domain.notification.Notification;
import com.pingnpay.domain.notification.NotificationChannel;

/**
 * Strategy interface — one implementation per delivery channel.
 */
public interface NotificationSender {

    NotificationChannel channel();

    /**
     * Attempt to send the notification.
     * Implementations must NOT throw — catch exceptions internally and
     * update notification status to FAILED with the error message.
     */
    void send(Notification notification);
}
