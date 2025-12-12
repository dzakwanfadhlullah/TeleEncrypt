import React, { useState, useEffect } from 'react';
import { MatrixBackground } from './components/MatrixBackground';
import { WelcomePortal } from './components/screens/WelcomePortal';
import { Authentication } from './components/screens/Authentication';
import { Dashboard } from './components/screens/Dashboard';
import { ProfileScreen } from './components/screens/ProfileScreen';
import { DetailModal } from './components/modals/DetailModal';
import { EditProfileModal } from './components/modals/EditProfileModal';
import { Toast } from './components/design-system/Toast';
import {
  registerUser, loginUser, listFiles, uploadFile, deleteRemoteFile, RemoteFile,
} from './api';
import { getOrCreateKey, encryptFile } from './utils/crypto';

type Screen = 'welcome' | 'login' | 'register' | 'dashboard' | 'profile';

interface FileItem {
  id: string; name: string; size: string; type: 'document' | 'image' | 'code'; uploadedAt: string;
}

function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('welcome');
  const [selectedFileId, setSelectedFileId] = useState<string | null>(null);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [files, setFiles] = useState<FileItem[]>([]);

  // --- PERSISTENCE HELPERS (AVATAR ONLY) ---
  const getStoredAvatar = (email: string) => localStorage.getItem(`tele_avatar_${email}`);
  const saveStoredAvatar = (email: string, url: string) => localStorage.setItem(`tele_avatar_${email}`, url);

  // Load User dari LocalStorage (Agar tahan refresh)
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('tele_user_session');
    return saved ? JSON.parse(saved) : {
      name: 'User', email: '', avatarUrl: null, authMethod: '', joinedDate: ''
    };
  });

  const updateUserState = (newData: any) => {
    const merged = { ...user, ...newData };
    setUser(merged);
    localStorage.setItem('tele_user_session', JSON.stringify(merged));
  };

  // Cek sesi login
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token && user.email && currentScreen === 'welcome') {
        setCurrentScreen('dashboard');
    }
  }, []);

  // --- FORMATTERS ---
  const formatFileSize = (bytes: number) => {
    if (!bytes) return '0 B';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const getFileType = (n: string) => {
    const ext = n.split('.').pop()?.toLowerCase() || '';
    if (['jpg','png','gif','svg','webp'].includes(ext)) return 'image';
    if (['js','ts','json','html','css'].includes(ext)) return 'code';
    return 'document';
  };

  const mapFile = (f: RemoteFile): FileItem => ({
    id: String(f.id), name: f.filename, size: formatFileSize(f.size), type: getFileType(f.filename), uploadedAt: new Date(f.createdAt).toLocaleDateString()
  });

  const showNotification = (msg: string) => { setToastMessage(msg); setShowToast(true); };

  // --- HANDLERS ---
  const handleLogin = async (email: string, password: string) => {
    try {
      if (currentScreen === 'register') {
        await registerUser({ username: email.split('@')[0], email, password });
        showNotification('Account created! Login please.');
        setCurrentScreen('login');
        return;
      }

      const res = await loginUser({ email, password });
      await getOrCreateKey();

      const u = res.user || res;
      const userEmail = u.email || email;
      const existingAvatar = getStoredAvatar(userEmail);

      const userData = {
        name: u.username || 'User',
        email: userEmail,
        avatarUrl: existingAvatar || null, // Avatar tetap lokal
        authMethod: 'API Auth',
        joinedDate: u.createdAt || 'Now',
      };

      updateUserState(userData);
      showNotification('Welcome back!');
      setCurrentScreen('dashboard');
    } catch (err: any) {
      showNotification(err.message || 'Auth failed');
    }
  };

  const handleLogout = () => {
    setCurrentScreen('welcome');
    localStorage.removeItem('tele_user_session'); 
    localStorage.removeItem('token');
    showNotification('Logged out.');
  };

  // FETCH FILES DARI REAL BACKEND
  const fetchFiles = async () => {
    try {
      const remote = await listFiles();
      // Backend mungkin return null kalau kosong
      if(Array.isArray(remote)) {
        setFiles(remote.map(mapFile).reverse());
      } else {
        setFiles([]);
      }
    } catch { 
      // Jangan spam error kalau cuma masalah koneksi, cukup console
      console.warn('Failed to connect to backend for files.');
    }
  };

  useEffect(() => {
    if (currentScreen === 'dashboard') {
      fetchFiles();
    }
  }, [currentScreen]);

  const handleUpload = async (file: File) => {
    try {
      showNotification('Encrypting...');
      
      const key = await getOrCreateKey();
      const encBlob = await encryptFile(file, key);
      
      // Bungkus Blob Enkripsi jadi File
      const encFile = new File([encBlob], file.name, { type: file.type });
      
      // UPLOAD KE REAL BACKEND
      const uploaded = await uploadFile(encFile);
      
      // Update UI dari response backend
      setFiles(prev => [mapFile(uploaded), ...prev]);
      
      showNotification('Encrypted & Uploaded to Cloud ✅');
    } catch (e: any) { 
        console.error(e);
        showNotification(e.message || 'Upload failed'); 
    }
  };

  const handleDelete = async () => {
    if (!selectedFileId) return;
    try {
      await deleteRemoteFile(selectedFileId);
      setFiles(prev => prev.filter(f => f.id !== selectedFileId));
      setSelectedFileId(null);
      showNotification('Deleted from Cloud 🗑️');
    } catch { showNotification('Delete failed'); }
  };

  const handleSaveProfile = (name: string, newAvatarUrl?: string) => {
    updateUserState({ name, ...(newAvatarUrl && { avatarUrl: newAvatarUrl }) });
    if (newAvatarUrl && user.email) saveStoredAvatar(user.email, newAvatarUrl);
    showNotification('Profile updated ✅');
  };

  const selectedFile = files.find(f => f.id === selectedFileId);

  return (
    <>
      <MatrixBackground />
      {currentScreen === 'welcome' && <WelcomePortal onNavigate={setCurrentScreen} />}
      {(currentScreen === 'login' || currentScreen === 'register') && (
        <Authentication mode={currentScreen} onBack={() => setCurrentScreen('welcome')} onLogin={handleLogin} />
      )}
      {currentScreen === 'dashboard' && (
        <Dashboard
          user={user} files={files} onFileClick={setSelectedFileId} onUploadFile={handleUpload}
          onViewProfile={() => setCurrentScreen('profile')} onEditProfile={() => setShowEditProfile(true)} onLogout={handleLogout}
        />
      )}
      {currentScreen === 'profile' && (
        <ProfileScreen user={user} onBack={() => setCurrentScreen('dashboard')} onEditProfile={() => setShowEditProfile(true)} onLogout={handleLogout} />
      )}
      {selectedFileId && selectedFile && (
        <DetailModal fileId={selectedFile.id} fileName={selectedFile.name} fileSize={selectedFile.size} onClose={() => setSelectedFileId(null)} onDelete={handleDelete} />
      )}
      {showEditProfile && (
        <EditProfileModal user={user} onClose={() => setShowEditProfile(false)} onSave={handleSaveProfile} />
      )}
      {showToast && <Toast message={toastMessage} onClose={() => setShowToast(false)} />}
    </>
  );
}

export default App;