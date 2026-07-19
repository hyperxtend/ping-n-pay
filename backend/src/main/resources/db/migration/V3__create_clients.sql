-- V3: Create clients table
CREATE TABLE clients (
    id              UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
    organisation_id UUID         NOT NULL REFERENCES organisations(id) ON DELETE CASCADE,
    name            VARCHAR(255) NOT NULL,
    email           VARCHAR(255) NOT NULL,
    phone           VARCHAR(50),
    address         TEXT,
    created_at      TIMESTAMPTZ  NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ  NOT NULL DEFAULT now()
);

CREATE INDEX idx_clients_organisation_id ON clients(organisation_id);
CREATE INDEX idx_clients_email ON clients(email);
