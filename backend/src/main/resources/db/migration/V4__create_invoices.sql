-- V4: Create invoices and invoice_items tables

CREATE TABLE invoices (
    id              UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
    organisation_id UUID          NOT NULL REFERENCES organisations(id) ON DELETE CASCADE,
    client_id       UUID          NOT NULL REFERENCES clients(id),
    number          VARCHAR(50)   NOT NULL,
    status          VARCHAR(50)   NOT NULL DEFAULT 'DRAFT',
    issue_date      DATE          NOT NULL,
    due_date        DATE          NOT NULL,
    subtotal        NUMERIC(12,2) NOT NULL DEFAULT 0,
    tax_amount      NUMERIC(12,2) NOT NULL DEFAULT 0,
    discount_amount NUMERIC(12,2) NOT NULL DEFAULT 0,
    total           NUMERIC(12,2) NOT NULL DEFAULT 0,
    currency        VARCHAR(10)   NOT NULL DEFAULT 'GBP',
    notes           TEXT,
    created_at      TIMESTAMPTZ   NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ   NOT NULL DEFAULT now(),
    UNIQUE (organisation_id, number)
);

CREATE TABLE invoice_items (
    id          UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
    invoice_id  UUID          NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
    description VARCHAR(500)  NOT NULL,
    quantity    NUMERIC(10,2) NOT NULL DEFAULT 1,
    unit_price  NUMERIC(12,2) NOT NULL,
    tax_rate    NUMERIC(5,2)  NOT NULL DEFAULT 0,
    amount      NUMERIC(12,2) NOT NULL,
    sort_order  INTEGER       NOT NULL DEFAULT 0
);

CREATE INDEX idx_invoices_organisation_id ON invoices(organisation_id);
CREATE INDEX idx_invoices_client_id       ON invoices(client_id);
CREATE INDEX idx_invoices_status          ON invoices(status);
CREATE INDEX idx_invoices_due_date        ON invoices(due_date);
CREATE INDEX idx_invoice_items_invoice_id ON invoice_items(invoice_id);
