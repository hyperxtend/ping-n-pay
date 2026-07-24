-- V6: Notifications — audit log of every notification dispatched

CREATE TABLE notifications (
    id            UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
    invoice_id    UUID         NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
    rule_id       UUID         REFERENCES notification_rules(id) ON DELETE SET NULL,
    channel       VARCHAR(50)  NOT NULL,
    recipient     VARCHAR(255) NOT NULL,
    status        VARCHAR(50)  NOT NULL DEFAULT 'PENDING',
    scheduled_at  TIMESTAMPTZ  NOT NULL,
    sent_at       TIMESTAMPTZ,
    error_message TEXT,
    created_at    TIMESTAMPTZ  NOT NULL DEFAULT now()
);

CREATE INDEX idx_notifications_invoice_id   ON notifications(invoice_id);
CREATE INDEX idx_notifications_status       ON notifications(status);
CREATE INDEX idx_notifications_scheduled_at ON notifications(scheduled_at);
