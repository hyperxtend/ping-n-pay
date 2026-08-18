ALTER TABLE users
    ADD COLUMN IF NOT EXISTS mfa_enabled        BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN IF NOT EXISTS mfa_secret         VARCHAR(255),
    ADD COLUMN IF NOT EXISTS mfa_backup_codes   TEXT;   -- JSON array of hashed backup codes
