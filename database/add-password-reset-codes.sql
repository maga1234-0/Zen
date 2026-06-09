-- ============================================
-- TABLE: password_reset_codes
-- Stocke les codes de vérification pour reset password
-- ============================================

CREATE TABLE IF NOT EXISTS password_reset_codes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL,
  code VARCHAR(6) NOT NULL, -- Code à 6 chiffres
  expires_at TIMESTAMP NOT NULL,
  used_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Index pour performances
CREATE INDEX IF NOT EXISTS idx_password_reset_user ON password_reset_codes(user_id);
CREATE INDEX IF NOT EXISTS idx_password_reset_email ON password_reset_codes(email);
CREATE INDEX IF NOT EXISTS idx_password_reset_code ON password_reset_codes(code);
CREATE INDEX IF NOT EXISTS idx_password_reset_expires ON password_reset_codes(expires_at);

-- Fonction pour nettoyer les codes expirés (optionnel)
CREATE OR REPLACE FUNCTION cleanup_expired_reset_codes()
RETURNS void AS $$
BEGIN
  DELETE FROM password_reset_codes
  WHERE expires_at < NOW() - INTERVAL '1 day';
END;
$$ LANGUAGE plpgsql;

-- Commentaires
COMMENT ON TABLE password_reset_codes IS 'Codes de vérification pour réinitialisation mot de passe';
COMMENT ON COLUMN password_reset_codes.code IS 'Code à 6 chiffres envoyé par email';
COMMENT ON COLUMN password_reset_codes.expires_at IS 'Date d''expiration (15 minutes après création)';
COMMENT ON COLUMN password_reset_codes.used_at IS 'Date d''utilisation du code (NULL si pas encore utilisé)';

SELECT 'Password reset codes table created successfully!' as status;
