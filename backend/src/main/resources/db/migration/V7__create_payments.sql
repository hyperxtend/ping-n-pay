CREATE TABLE payments (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    invoice_id      UUID NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
    amount          NUMERIC(19,4) NOT NULL,
    currency        VARCHAR(3) NOT NULL DEFAULT 'GBP',
    payment_method  VARCHAR(50) NOT NULL,
    reference       VARCHAR(255),
    notes           TEXT,
    paid_at         TIMESTAMPTZ NOT NULL DEFAULT now(),
    recorded_by     UUID REFERENCES users(id) ON DELETE SET NULL,
    stripe_payment_intent_id VARCHAR(255),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_payments_invoice_id ON payments(invoice_id);
CREATE INDEX idx_payments_paid_at    ON payments(paid_at DESC);

-- Add amount_paid column to invoices to track running total
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS amount_paid NUMERIC(19,4) NOT NULL DEFAULT 0;

-- Stripe-specific: store payment intent / checkout session IDs on invoices
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS stripe_payment_intent_id VARCHAR(255);
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS stripe_checkout_session_id VARCHAR(255);
