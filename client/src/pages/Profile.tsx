import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { User, Mail, Shield, Calendar, Lock, Eye, EyeOff, Camera } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useToastContext } from '@/App';
import api from '@/services/api';

export const Profile = () => {
  const { user, setAuth } = useAuthStore();
  const toast = useToastContext();
  const [showPasswordSection, setShowPasswordSection] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isUploadingPicture, setIsUploadingPicture] = useState(false);
  const [profilePicture, setProfilePicture] = useState(user?.profile_picture || '');
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Les nouveaux mots de passe ne correspondent pas');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    setIsChangingPassword(true);

    try {
      await api.put('/users/change-password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });

      toast.success('Mot de passe modifié avec succès !');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      setShowPasswordSection(false);
    } catch (error: any) {
      console.error('Password change error:', error);
      const errorMsg = error.response?.data?.message || 'Échec de la modification du mot de passe';
      toast.error(errorMsg);
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleProfilePictureUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Veuillez télécharger un fichier image');
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error('La taille de l\'image doit être inférieure à 2 Mo');
      return;
    }

    setIsUploadingPicture(true);

    try {
      // Convert image to base64
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64String = reader.result as string;
        
        try {
          // Upload to server
          await api.put('/users/profile-picture', {
            profilePicture: base64String,
          });

          // Update local state and auth store
          setProfilePicture(base64String);
          if (user) {
            setAuth({ ...user, profile_picture: base64String }, useAuthStore.getState().token || '');
          }

          toast.success('Photo de profil mise à jour avec succès !');
        } catch (error: any) {
          console.error('Upload error:', error);
          toast.error(error.response?.data?.message || 'Échec du téléchargement de la photo de profil');
        } finally {
          setIsUploadingPicture(false);
        }
      };

      reader.onerror = () => {
        toast.error('Échec de la lecture du fichier image');
        setIsUploadingPicture(false);
      };

      reader.readAsDataURL(file);
    } catch (error) {
      toast.error('Échec du traitement de l\'image');
      setIsUploadingPicture(false);
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300';
      case 'manager':
        return 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300';
      case 'receptionist':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300';
      case 'housekeeping':
        return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300';
      case 'maintenance':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300';
      case 'accountant':
        return 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-slate-600 dark:text-slate-200';
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">My Profile</h1>
        <p className="text-gray-500 dark:text-slate-300">Manage your account information and security</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Information Card */}
        <div className="lg:col-span-2">
          <Card>
            <div className="flex items-center gap-4 mb-6">
              <div className="relative group">
                <div className="w-20 h-20 bg-gradient-to-br from-seafoam-400 to-seafoam-600 rounded-full flex items-center justify-center overflow-hidden">
                  {profilePicture ? (
                    <img src={profilePicture} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-10 h-10 text-white" />
                  )}
                </div>
                <label 
                  htmlFor="profile-picture-upload"
                  className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                >
                  {isUploadingPicture ? (
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <Camera className="w-6 h-6 text-white" />
                  )}
                </label>
                <input
                  id="profile-picture-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleProfilePictureUpload}
                  className="hidden"
                  disabled={isUploadingPicture}
                />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">{user?.firstName} {user?.lastName}</h2>
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium mt-1 ${getRoleBadgeColor(user?.role || '')}`}>
                  {user?.role?.toUpperCase()}
                </span>
                <p className="text-xs text-gray-500 dark:text-slate-400 mt-2">
                  Hover over picture to change
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-slate-700 rounded-lg">
                <Mail className="w-5 h-5 text-gray-500 dark:text-slate-400" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-slate-400">Email Address</p>
                  <p className="font-medium text-gray-800 dark:text-white">{user?.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-slate-700 rounded-lg">
                <Shield className="w-5 h-5 text-gray-500 dark:text-slate-400" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-slate-400">Role</p>
                  <p className="font-medium text-gray-800 dark:text-white capitalize">{user?.role}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-slate-700 rounded-lg">
                <User className="w-5 h-5 text-gray-500 dark:text-slate-400" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-slate-400">Full Name</p>
                  <p className="font-medium text-gray-800 dark:text-white">{user?.firstName} {user?.lastName}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-slate-700 rounded-lg">
                <Calendar className="w-5 h-5 text-gray-500 dark:text-slate-400" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-slate-400">Account Status</p>
                  <p className="font-medium text-green-600 dark:text-green-400">Active</p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Security Card */}
        <div>
          <Card>
            <div className="flex items-center gap-3 mb-4">
              <Lock className="w-6 h-6 text-seafoam-600 dark:text-seafoam-400" />
              <h3 className="text-xl font-bold text-gray-800 dark:text-white">Security</h3>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-seafoam-50 dark:bg-seafoam-900/20 border border-seafoam-200 dark:border-seafoam-800 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-slate-300 mb-2">
                  Keep your account secure by using a strong password
                </p>
                <Button
                  onClick={() => setShowPasswordSection(!showPasswordSection)}
                  className="w-full bg-seafoam-500 hover:bg-seafoam-600"
                >
                  <Lock className="w-4 h-4 mr-2" />
                  Change Password
                </Button>
              </div>

              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <p className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-1">
                  Password Requirements:
                </p>
                <ul className="text-xs text-blue-600 dark:text-blue-400 space-y-1">
                  <li>• At least 6 characters long</li>
                  <li>• Mix of letters and numbers recommended</li>
                  <li>• Avoid common passwords</li>
                </ul>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Change Password Section */}
      {showPasswordSection && (
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white">Change Password</h3>
            <Button
              variant="ghost"
              onClick={() => setShowPasswordSection(false)}
              className="text-gray-500 dark:text-slate-400"
            >
              Cancel
            </Button>
          </div>

          <form onSubmit={handlePasswordChange} className="space-y-4 max-w-md">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                Current Password
              </label>
              <div className="relative">
                <input
                  type={showCurrentPassword ? 'text' : 'password'}
                  required
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                  className="w-full px-4 py-2 pr-10 border dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-seafoam-400 dark:bg-slate-700 dark:text-white"
                  placeholder="Enter current password"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-slate-400"
                >
                  {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  required
                  minLength={6}
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  className="w-full px-4 py-2 pr-10 border dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-seafoam-400 dark:bg-slate-700 dark:text-white"
                  placeholder="Enter new password"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-slate-400"
                >
                  {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  minLength={6}
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  className="w-full px-4 py-2 pr-10 border dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-seafoam-400 dark:bg-slate-700 dark:text-white"
                  placeholder="Confirm new password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-slate-400"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isChangingPassword}
              className="w-full bg-seafoam-500 hover:bg-seafoam-600 disabled:opacity-50"
            >
              {isChangingPassword ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Changing Password...
                </div>
              ) : (
                'Change Password'
              )}
            </Button>
          </form>
        </Card>
      )}
    </div>
  );
};
