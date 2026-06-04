# 🔐 Fonctionnalité de Réinitialisation de Mot de Passe

## CE QUI A ÉTÉ AJOUTÉ

### 1. Backend - Endpoint Admin Reset Password

**Fichier**: `zen_backend/src/routes/userRoutes.ts`

**Nouveau endpoint**: `PUT /users/:id/reset-password`

**Fonctionnalités:**
- ✅ Permet aux admins et managers de réinitialiser le mot de passe d'un utilisateur
- ✅ Validation: minimum 6 caractères
- ✅ Vérifie que l'utilisateur cible existe
- ✅ Log de l'action pour audit
- ✅ Retourne info de l'utilisateur modifié

**Permissions requises:**
- Admin (role = 'admin')
- Manager (role = 'manager')

**Utilisation:**
```javascript
PUT /users/{userId}/reset-password
Headers: { Authorization: 'Bearer {token}' }
Body: {
  "newPassword": "newpass123"
}

Response 200:
{
  "message": "Password reset successfully",
  "user": {
    "id": "...",
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

---

## 2. Frontend - À AJOUTER dans Staff.tsx

### Modifications nécessaires:

#### A. Ajouter l'état pour le modal de reset password

```typescript
const [showResetPasswordModal, setShowResetPasswordModal] = useState(false);
const [resetPasswordUserId, setResetPasswordUserId] = useState<string | null>(null);
const [newPassword, setNewPassword] = useState('');
const [showPassword, setShowPassword] = useState(false);
```

#### B. Ajouter la mutation pour reset password

```typescript
const resetPasswordMutation = useMutation({
  mutationFn: async (data: { userId: string; newPassword: string }) => {
    const res = await api.put(`/users/${data.userId}/reset-password`, {
      newPassword: data.newPassword
    });
    return res.data;
  },
  onSuccess: (data) => {
    toast.success(`Password reset successfully for ${data.user.name}`);
    setShowResetPasswordModal(false);
    setNewPassword('');
    setResetPasswordUserId(null);
  },
  onError: (error: any) => {
    const errorMessage = error.response?.data?.message || 'Failed to reset password';
    toast.error(errorMessage);
  },
});
```

#### C. Ajouter le handler

```typescript
const handleResetPassword = (userId: string) => {
  setResetPasswordUserId(userId);
  setShowResetPasswordModal(true);
};

const handleSubmitResetPassword = (e: React.FormEvent) => {
  e.preventDefault();
  
  if (newPassword.length < 6) {
    toast.error('Password must be at least 6 characters');
    return;
  }

  if (!resetPasswordUserId) return;

  resetPasswordMutation.mutate({
    userId: resetPasswordUserId,
    newPassword: newPassword
  });
};
```

#### D. Ajouter le bouton dans le modal Edit Staff

Dans le modal "Edit Staff", ajouter un bouton "Reset Password" avant les boutons Cancel/Save:

```tsx
<div className="border-t dark:border-slate-600 pt-4 mt-4">
  <button
    type="button"
    onClick={() => handleResetPassword(editingStaff.id)}
    className="w-full px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg flex items-center justify-center gap-2"
  >
    <Lock className="w-4 h-4" />
    Reset Password
  </button>
  <p className="text-xs text-gray-500 dark:text-slate-400 mt-2 text-center">
    This will allow you to set a new password for this user
  </p>
</div>
```

#### E. Ajouter le modal Reset Password

```tsx
{/* Reset Password Modal */}
<AnimatePresence>
  {showResetPasswordModal && resetPasswordUserId && (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => setShowResetPasswordModal(false)}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md p-6 border dark:border-slate-700">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Reset Password</h2>
            <button
              onClick={() => setShowResetPasswordModal(false)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg"
            >
              <X className="w-5 h-5 text-gray-500 dark:text-slate-300" />
            </button>
          </div>

          <form onSubmit={handleSubmitResetPassword} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-200 mb-2">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-2 pr-10 border dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-seafoam-400 dark:bg-slate-700 dark:text-white"
                  placeholder="Enter new password"
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">
                Minimum 6 characters
              </p>
            </div>

            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3">
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                ⚠️ This will change the user's password immediately. The user will need to use this new password to log in.
              </p>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={() => setShowResetPasswordModal(false)}
                className="flex-1 px-4 py-2 border dark:border-slate-600 dark:text-slate-200 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={resetPasswordMutation.isPending}
                className="flex-1 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {resetPasswordMutation.isPending ? 'Resetting...' : 'Reset Password'}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </>
  )}
</AnimatePresence>
```

#### F. Ajouter les imports nécessaires

```typescript
import { Lock, Eye, EyeOff } from 'lucide-react';
```

---

## 3. DÉPLOIEMENT

### Étape 1: Déployer le backend

```bash
cd zen_backend
git add -A
git commit -m "feat: add admin password reset endpoint"
git push origin main
```

Attendre 3-5 minutes que Render redéploie.

### Étape 2: Modifier le frontend

Appliquer les modifications A, B, C, D, E, F dans `client/src/pages/Staff.tsx`.

### Étape 3: Déployer le frontend

```bash
cd client (ou à la racine)
git add -A
git commit -m "feat: add admin password reset feature in Staff page"
git push origin main
```

Attendre 2-3 minutes que Vercel redéploie.

---

## 4. UTILISATION

### Pour un utilisateur normal (Profile):

1. Aller sur **Profile** (cliquer sur son nom en haut à droite)
2. Cliquer sur **"Change Password"**
3. Entrer:
   - Current Password (mot de passe actuel)
   - New Password (nouveau mot de passe)
   - Confirm New Password (confirmation)
4. Cliquer **"Change Password"**

### Pour un admin (Staff page):

1. Aller sur **Staff**
2. Cliquer sur le bouton **Edit** (icône crayon) d'un utilisateur
3. Dans le modal, cliquer sur **"Reset Password"**
4. Entrer le nouveau mot de passe
5. Cliquer **"Reset Password"**
6. ✅ Le mot de passe est changé immédiatement
7. Informer l'utilisateur de son nouveau mot de passe

---

## 5. SÉCURITÉ

### Bonnes pratiques appliquées:

✅ **Permissions**: Seulement admin et manager peuvent réinitialiser
✅ **Validation**: Minimum 6 caractères
✅ **Audit**: Log de l'action dans la console serveur
✅ **Feedback**: Message de confirmation à l'admin
✅ **UI Warning**: Avertissement avant de confirmer

### Améliorations futures possibles:

- 🔒 Utiliser bcrypt pour hasher les mots de passe
- 📧 Envoyer un email à l'utilisateur quand son mot de passe est changé
- 📝 Logger dans une table audit_logs
- 🔐 Générer un mot de passe temporaire aléatoire
- ⏰ Forcer le changement de mot de passe au premier login

---

## 6. TESTS

### Test 1: Reset password as admin

1. Se connecter en tant qu'admin
2. Aller sur Staff
3. Éditer un utilisateur test
4. Cliquer "Reset Password"
5. Entrer "newpass123"
6. ✅ Devrait réussir

### Test 2: Login avec le nouveau mot de passe

1. Se déconnecter
2. Se connecter avec l'email de l'utilisateur test
3. Utiliser "newpass123" comme mot de passe
4. ✅ Devrait se connecter

### Test 3: Validation

1. Essayer de réinitialiser avec un mot de passe < 6 caractères
2. ✅ Devrait afficher une erreur

### Test 4: Permissions

1. Se connecter en tant que receptionist ou housekeeping
2. ✅ Ne devrait PAS voir le bouton "Reset Password"

---

## 7. RÉSUMÉ

**✅ Backend déployé**: Endpoint `/users/:id/reset-password` créé  
**⏳ Frontend à modifier**: Ajouter le modal et les handlers  
**📋 Documentation**: Ce fichier  

**Temps estimé**: 10-15 minutes pour modifications frontend + déploiement

---

**Date**: 2 juin 2026  
**Feature**: Admin Password Reset  
**Status**: ✅ Backend prêt, ⏳ Frontend à implémenter
