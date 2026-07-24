-- V5: Notification rules — define when and on which channels to remind clients

CREATE TABLE notification_rules (
    id                  UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
    organisation_id     UUID         NOT NULL REFERENCES organisations(id) ON DELETE CASCADE,
    name                VARCHAR(255) NOT NULL,
    -- Days relative to invoice due date.
    -- Negative = before due date (e.g. -7 = 7 days before).
    -- Zero     = on the due date.
    -- Positive = after due date / overdue (e.g. 3 = 3 days overdue).
    trigger_days_offset INTEGER      NOT NULL,
    active              BOOLEAN      NOT NULL DEFAULT true,
    created_at          TIMESTAMPTZ  NOT NULL DEFAULT now(),
    updated_at          TIMESTAMPTZ  NOT NULL DEFAULT now()
);

-- Channels enabled for each rule (EMAIL, SMS, IN_APP, WHATSAPP)
CREATE TABLE notification_rule_channels (
    rule_id UUID        NOT NULL REFERENCES notification_rules(id) ON DELETE CASCADE,
    channel VARCHAR(50) NOT NULL,
    PRIMARY KEY (rule_id, channel)
);

CREATE INDEX idx_notification_rules_org_id ON notification_rules(organisation_id);
