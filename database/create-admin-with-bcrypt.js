// ============================================
// SCRIPT POUR CRÉER UN UTILISATEUR ADMIN
// ============================================
// Ce script génère un hash bcrypt valide et crée un SQL
// pour insérer l'utilisateur dans Supabase
//
// UTILISATION:
// 1. Installer bcrypt: npm install bcrypt
// 2. Exécuter: node create-admin-with-bcrypt.js
// 3. Copier le SQL généré
// 4. Coller dans Supabase SQL Editor
// 5. Cliquer RUN
// ============================================

const bcrypt = require('bcrypt');

// Mot de passe à hasher
const password = 'admin123';

// Générer le hash
bcrypt.hash(password, 10, (err, hash) => {
    if (err) {
        console.error('❌ Erreur:', err);
        return;
    }

    console.log('\n✅ Hash généré avec succès!\n');
    console.log('📋 COPIEZ ET EXÉCUTEZ CE SQL DANS SUPABASE:\n');
    console.log('-- ============================================');
    console.log('-- CRÉER UTILISATEUR ADMIN');
    console.log('-- ============================================\n');
    console.log('-- Supprimer l\'ancien utilisateur s\'il existe');
    console.log('DELETE FROM users WHERE email = \'admin@hotel.com\';\n');
    console.log('-- Créer le nouvel utilisateur');
    console.log('INSERT INTO users (');
    console.log('    email,');
    console.log('    password_hash,');
    console.log('    first_name,');
    console.log('    last_name,');
    console.log('    phone,');
    console.log('    role,');
    console.log('    is_active');
    console.log(') VALUES (');
    console.log('    \'admin@hotel.com\',');
    console.log(`    '${hash}',`);
    console.log('    \'Admin\',');
    console.log('    \'User\',');
    console.log('    \'+1234567890\',');
    console.log('    \'admin\',');
    console.log('    true');
    console.log(');\n');
    console.log('-- Vérifier');
    console.log('SELECT email, first_name, last_name, role FROM users WHERE email = \'admin@hotel.com\';\n');
    console.log('-- ============================================\n');
    console.log('📧 Email: admin@hotel.com');
    console.log('🔑 Mot de passe: admin123');
    console.log('🌐 URL: https://zen-lyart.vercel.app\n');
});
