-- ============================================
-- CRÉER TABLE EMAIL_LOGS
-- ============================================
-- Cette table enregistre tous les emails envoyés via Resend
-- Nécessaire pour le système de réinitialisation de mot de passe
-- 
-- À EXÉCUTER DANS: Supabase SQL Editor
-- URL: https://supabase.com/dashboard → SQL Editor
-- ============================================

-- Supprimer la table si elle existe déjà (pour réinitialisation)
DROP TABLE IF EXISTS email_logs CASCADE;

-- Créer la table email_logs
CREATE TABLE email_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  to_email VARCHAR(255) NOT NULL,
  from_email VARCHAR(255) NOT NULL,
  subject TEXT NOT NULL,
  email_type VARCHAR(50) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'sent',
  error_message TEXT,
  resend_id VARCHAR(255),
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Créer des index pour améliorer les performances
CREATE INDEX idx_email_logs_to_email ON email_logs(to_email);
CREATE INDEX idx_email_logs_email_type ON email_logs(email_type);
CREATE INDEX idx_email_logs_sent_at ON email_logs(sent_at DESC);
CREATE INDEX idx_email_logs_status ON email_logs(status);

-- Ajouter des commentaires pour documentation
COMMENT ON TABLE email_logs IS 'Logs de tous les emails envoyés via Resend API';
COMMENT ON COLUMN email_logs.id IS 'Identifiant unique du log';
COMMENT ON COLUMN email_logs.to_email IS 'Adresse email du destinataire';
COMMENT ON COLUMN email_logs.from_email IS 'Adresse email de l''expéditeur';
COMMENT ON COLUMN email_logs.subject IS 'Sujet de l''email';
COMMENT ON COLUMN email_logs.email_type IS 'Type d''email: password_reset, booking_confirmation, etc.';
COMMENT ON COLUMN email_logs.status IS 'Statut: sent, failed, pending';
COMMENT ON COLUMN email_logs.error_message IS 'Message d''erreur si échec';
COMMENT ON COLUMN email_logs.resend_id IS 'ID de l''email dans Resend';
COMMENT ON COLUMN email_logs.sent_at IS 'Date et heure d''envoi';
COMMENT ON COLUMN email_logs.created_at IS 'Date et heure de création du log';

-- Vérifier que la table a été créée
SELECT 
  table_name, 
  table_type
FROM information_schema.tables
WHERE table_name = 'email_logs';

-- Afficher la structure de la table
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_name = 'email_logs'
ORDER BY ordinal_position;

-- ============================================
-- RÉSULTAT ATTENDU
-- ============================================
-- La table email_logs doit être créée avec:
-- - 10 colonnes
-- - 4 index
-- - Commentaires sur table et colonnes
-- 
-- ✅ Si vous voyez "CREATE TABLE" → Succès!
-- ❌ Si erreur → Copier l'erreur et demander aide
-- ============================================
