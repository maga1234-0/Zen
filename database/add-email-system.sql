-- ============================================
-- EMAIL SYSTEM TABLES
-- ============================================
-- Description: Tables pour système d'emails automatiques
-- Date: 7 juin 2026
-- ============================================

-- Extension UUID si pas encore activée
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- Table: email_logs
-- Stocke l'historique de tous les emails envoyés
-- ============================================
CREATE TABLE IF NOT EXISTS email_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  booking_id INTEGER REFERENCES bookings(id) ON DELETE SET NULL,
  guest_id INTEGER REFERENCES guests(id) ON DELETE SET NULL,
  
  -- Type d'email
  type VARCHAR(50) NOT NULL,
  -- Types possibles:
  --   - booking_confirmation
  --   - checkin_reminder
  --   - checkout_reminder
  --   - invoice
  --   - password_reset
  --   - welcome
  --   - payment_received
  --   - booking_cancelled
  
  -- Destinataire
  recipient_email VARCHAR(255) NOT NULL,
  recipient_name VARCHAR(255),
  
  -- Contenu
  subject VARCHAR(500) NOT NULL,
  
  -- Statut
  status VARCHAR(20) DEFAULT 'pending',
  -- Statuts possibles: pending, sent, failed, bounced
  
  error_message TEXT,
  
  -- Timestamps
  sent_at TIMESTAMP,
  opened_at TIMESTAMP, -- Si tracking activé
  clicked_at TIMESTAMP, -- Si tracking activé
  
  -- Métadonnées (JSON)
  metadata JSONB DEFAULT '{}'::jsonb,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- Index pour performances
-- ============================================
CREATE INDEX IF NOT EXISTS idx_email_logs_user ON email_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_email_logs_booking ON email_logs(booking_id);
CREATE INDEX IF NOT EXISTS idx_email_logs_guest ON email_logs(guest_id);
CREATE INDEX IF NOT EXISTS idx_email_logs_type ON email_logs(type);
CREATE INDEX IF NOT EXISTS idx_email_logs_status ON email_logs(status);
CREATE INDEX IF NOT EXISTS idx_email_logs_recipient ON email_logs(recipient_email);
CREATE INDEX IF NOT EXISTS idx_email_logs_created ON email_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_email_logs_sent ON email_logs(sent_at DESC);

-- ============================================
-- Table: email_templates
-- Templates configurables pour les emails
-- ============================================
CREATE TABLE IF NOT EXISTS email_templates (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  code VARCHAR(50) UNIQUE NOT NULL,
  description TEXT,
  
  -- Contenu
  subject VARCHAR(500) NOT NULL,
  html_content TEXT NOT NULL,
  text_content TEXT, -- Version texte brut (fallback)
  
  -- Variables disponibles (JSON array)
  variables JSONB DEFAULT '[]'::jsonb,
  -- Ex: ["guestName", "bookingRef", "checkInDate", "totalAmount"]
  
  -- Configuration
  is_active BOOLEAN DEFAULT true,
  language VARCHAR(10) DEFAULT 'fr',
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- Index pour email_templates
-- ============================================
CREATE INDEX IF NOT EXISTS idx_email_templates_code ON email_templates(code);
CREATE INDEX IF NOT EXISTS idx_email_templates_active ON email_templates(is_active);
CREATE INDEX IF NOT EXISTS idx_email_templates_language ON email_templates(language);

-- ============================================
-- Table: email_queue
-- Queue pour envoi asynchrone (optionnel)
-- ============================================
CREATE TABLE IF NOT EXISTS email_queue (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  template_code VARCHAR(50) NOT NULL,
  recipient_email VARCHAR(255) NOT NULL,
  recipient_name VARCHAR(255),
  subject VARCHAR(500) NOT NULL,
  data JSONB NOT NULL, -- Variables pour le template
  
  -- Priorité (1 = haute, 5 = basse)
  priority INTEGER DEFAULT 3,
  
  -- Tentatives
  attempts INTEGER DEFAULT 0,
  max_attempts INTEGER DEFAULT 3,
  
  -- Statut
  status VARCHAR(20) DEFAULT 'pending',
  -- Statuts: pending, processing, sent, failed
  
  error_message TEXT,
  
  -- Schedule
  scheduled_at TIMESTAMP DEFAULT NOW(),
  processed_at TIMESTAMP,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- Index pour email_queue
-- ============================================
CREATE INDEX IF NOT EXISTS idx_email_queue_status ON email_queue(status);
CREATE INDEX IF NOT EXISTS idx_email_queue_scheduled ON email_queue(scheduled_at);
CREATE INDEX IF NOT EXISTS idx_email_queue_priority ON email_queue(priority);
CREATE INDEX IF NOT EXISTS idx_email_queue_recipient ON email_queue(recipient_email);

-- ============================================
-- Fonction: Mise à jour automatic du updated_at
-- ============================================
CREATE OR REPLACE FUNCTION update_email_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers pour updated_at
DROP TRIGGER IF EXISTS email_logs_updated_at ON email_logs;
CREATE TRIGGER email_logs_updated_at
BEFORE UPDATE ON email_logs
FOR EACH ROW
EXECUTE FUNCTION update_email_updated_at();

DROP TRIGGER IF EXISTS email_templates_updated_at ON email_templates;
CREATE TRIGGER email_templates_updated_at
BEFORE UPDATE ON email_templates
FOR EACH ROW
EXECUTE FUNCTION update_email_updated_at();

DROP TRIGGER IF EXISTS email_queue_updated_at ON email_queue;
CREATE TRIGGER email_queue_updated_at
BEFORE UPDATE ON email_queue
FOR EACH ROW
EXECUTE FUNCTION update_email_updated_at();

-- ============================================
-- Données de test: Templates de base
-- ============================================
INSERT INTO email_templates (name, code, description, subject, html_content, variables) VALUES

-- 1. Confirmation de réservation
('Confirmation de Réservation', 'booking_confirmation', 
 'Email envoyé automatiquement lors de la création d''une réservation',
 'Confirmation de votre réservation #{{bookingRef}}',
 '<html><body><h1>Confirmation de Réservation</h1><p>Bonjour {{guestName}},</p><p>Votre réservation est confirmée!</p></body></html>',
 '["guestName", "bookingRef", "roomNumber", "roomType", "checkInDate", "checkOutDate", "nights", "totalAmount", "hotelName", "hotelPhone", "hotelEmail"]'::jsonb),

-- 2. Rappel check-in
('Rappel Check-in', 'checkin_reminder',
 'Rappel envoyé 24h avant l''arrivée du client',
 'Rappel: Votre arrivée demain au {{hotelName}}',
 '<html><body><h1>Rappel Check-in</h1><p>Bonjour {{guestName}},</p><p>Nous vous attendons demain!</p></body></html>',
 '["guestName", "bookingRef", "checkInDate", "checkInTime", "roomNumber", "hotelName", "hotelAddress", "hotelPhone"]'::jsonb),

-- 3. Facture
('Envoi de Facture', 'invoice',
 'Email avec facture en pièce jointe',
 'Votre facture - Séjour au {{hotelName}}',
 '<html><body><h1>Facture</h1><p>Bonjour {{guestName}},</p><p>Veuillez trouver ci-joint votre facture.</p></body></html>',
 '["guestName", "invoiceNumber", "totalAmount", "checkInDate", "checkOutDate", "hotelName"]'::jsonb),

-- 4. Reset mot de passe
('Réinitialisation Mot de Passe', 'password_reset',
 'Email avec lien pour réinitialiser le mot de passe',
 'Réinitialisation de votre mot de passe',
 '<html><body><h1>Reset Password</h1><p>Cliquez sur le lien pour réinitialiser: {{resetLink}}</p></body></html>',
 '["userName", "resetLink", "expiresIn"]'::jsonb),

-- 5. Bienvenue
('Bienvenue', 'welcome',
 'Email de bienvenue pour nouveaux clients',
 'Bienvenue au {{hotelName}}!',
 '<html><body><h1>Bienvenue!</h1><p>Bonjour {{guestName}},</p><p>Merci de nous avoir choisis!</p></body></html>',
 '["guestName", "hotelName", "hotelEmail", "hotelPhone"]'::jsonb)

ON CONFLICT (code) DO NOTHING;

-- ============================================
-- Statistiques d'emails (Vue)
-- ============================================
CREATE OR REPLACE VIEW email_stats AS
SELECT 
  type,
  status,
  COUNT(*) as total,
  COUNT(CASE WHEN sent_at >= NOW() - INTERVAL '24 hours' THEN 1 END) as last_24h,
  COUNT(CASE WHEN sent_at >= NOW() - INTERVAL '7 days' THEN 1 END) as last_7days,
  COUNT(CASE WHEN sent_at >= NOW() - INTERVAL '30 days' THEN 1 END) as last_30days
FROM email_logs
GROUP BY type, status
ORDER BY type, status;

-- ============================================
-- Vue: Emails récents
-- ============================================
CREATE OR REPLACE VIEW recent_emails AS
SELECT 
  el.id,
  el.type,
  el.recipient_email,
  el.recipient_name,
  el.subject,
  el.status,
  el.sent_at,
  el.created_at,
  g.name as guest_name,
  b.reference as booking_reference,
  u.email as user_email
FROM email_logs el
LEFT JOIN guests g ON el.guest_id = g.id
LEFT JOIN bookings b ON el.booking_id = b.id
LEFT JOIN users u ON el.user_id = u.id
ORDER BY el.created_at DESC
LIMIT 100;

-- ============================================
-- Fonction: Ajouter email dans la queue
-- ============================================
CREATE OR REPLACE FUNCTION queue_email(
  p_template_code VARCHAR,
  p_recipient_email VARCHAR,
  p_recipient_name VARCHAR,
  p_data JSONB,
  p_priority INTEGER DEFAULT 3,
  p_scheduled_at TIMESTAMP DEFAULT NOW()
)
RETURNS UUID AS $$
DECLARE
  v_email_id UUID;
  v_template RECORD;
BEGIN
  -- Récupérer le template
  SELECT * INTO v_template FROM email_templates 
  WHERE code = p_template_code AND is_active = true;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Template % not found or inactive', p_template_code;
  END IF;
  
  -- Insérer dans la queue
  INSERT INTO email_queue (
    template_code,
    recipient_email,
    recipient_name,
    subject,
    data,
    priority,
    scheduled_at
  ) VALUES (
    p_template_code,
    p_recipient_email,
    p_recipient_name,
    v_template.subject,
    p_data,
    p_priority,
    p_scheduled_at
  )
  RETURNING id INTO v_email_id;
  
  RETURN v_email_id;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- Commentaires sur les tables
-- ============================================
COMMENT ON TABLE email_logs IS 'Historique de tous les emails envoyés par le système';
COMMENT ON TABLE email_templates IS 'Templates d''emails configurables';
COMMENT ON TABLE email_queue IS 'Queue pour envoi asynchrone d''emails';

COMMENT ON COLUMN email_logs.type IS 'Type d''email: booking_confirmation, invoice, reminder, etc.';
COMMENT ON COLUMN email_logs.status IS 'Statut: pending, sent, failed, bounced';
COMMENT ON COLUMN email_logs.metadata IS 'Métadonnées JSON (tracking, attachments, etc.)';

-- ============================================
-- Permissions
-- ============================================
-- Donner accès aux tables pour l'application
-- GRANT SELECT, INSERT, UPDATE ON email_logs TO hotel_app_user;
-- GRANT SELECT ON email_templates TO hotel_app_user;
-- GRANT SELECT, INSERT, UPDATE ON email_queue TO hotel_app_user;

-- ============================================
-- FIN DU SCRIPT
-- ============================================

-- Vérification
SELECT 'Email system tables created successfully!' as status;
SELECT COUNT(*) as template_count FROM email_templates;
