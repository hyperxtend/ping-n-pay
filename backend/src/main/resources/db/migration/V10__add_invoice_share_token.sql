-- Phase 7: client portal share token
-- Each invoice gets a unique, unguessable UUID that allows public (no-auth) access
-- to the invoice view and PDF download endpoints.

ALTER TABLE invoices
    ADD COLUMN IF NOT EXISTS share_token UUID NOT NULL DEFAULT gen_random_uuid();

-- Index for fast lookup by token (used on every public portal request)
CREATE UNIQUE INDEX IF NOT EXISTS idx_invoices_share_token ON invoices (share_token);
