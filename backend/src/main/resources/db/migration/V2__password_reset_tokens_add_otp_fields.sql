-- Add fields needed for OTP-based password reset flow.
-- Safe for PostgreSQL and H2 (PostgreSQL mode).

ALTER TABLE password_reset_tokens
    ADD COLUMN IF NOT EXISTS type VARCHAR(32) NOT NULL DEFAULT 'RESET_LINK';

ALTER TABLE password_reset_tokens
    ADD COLUMN IF NOT EXISTS attempts INTEGER NOT NULL DEFAULT 0;

