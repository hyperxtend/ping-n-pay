-- V1: Create organisations table
CREATE TABLE organisations (
    id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    name        VARCHAR(255) NOT NULL,
    logo_url    VARCHAR(500),
    address     TEXT,
    tax_id      VARCHAR(100),
    currency    VARCHAR(10)  NOT NULL DEFAULT 'GBP',
    created_at  TIMESTAMPTZ  NOT NULL DEFAULT now(),
    updated_at  TIMESTAMPTZ  NOT NULL DEFAULT now()
);
