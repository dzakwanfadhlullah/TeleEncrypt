import { useState, useEffect } from 'react';
import { MatrixBackground } from './components/MatrixBackground';
import { WelcomePortal } from './components/screens/WelcomePortal';
import { Authentication } from './components/screens/Authentication';
import { Dashboard } from './components/screens/Dashboard';
import { ProfileScreen } from './components/screens/ProfileScreen';
import { DetailModal } from './components/modals/DetailModal';
import { EditProfileModal } from './components/modals/EditProfileModal';
import { StorageOptionModal } from './components/modals/StorageOptionModal'; // Import Modal Baru
import { Toast } from './components/design-system/Toast';
import {
  registerUser, loginUser, listFiles, uploadFile, deleteFile, RemoteFile
} from './api';
import { getOrCreateKey, encryptFile } from './utils/crypto';

export type Screen = 'welcome' | 'login' | 'register' | 'dashboard' | 'profile';

// Update Interface: Tambah 'source'
interface FileItem {
  id: string;
  name: string;
  size: string;
  type: 'document' | 'image' | 'code';
  uploadedAt: string;
  source: 'cloud' | 'local';
}

function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('welcome');
  const [selectedFileId, setSelectedFileId] = useState<string | null>(null);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [files, setFiles] = useState<FileItem[]>([]);

  // State untuk Hybrid Upload Flow
  const [pendingFile, setPendingFile] = useState<File | null>(null); // File yang menunggu keputusan
  const [showStorageOption, setShowStorageOption] = useState(false); // Modal Pilihan

  // --- PERSISTENCE HELPERS ---
  const getStoredAvatar = (email: string) => localStorage.getItem(`tele_avatar_${email}`);
  const saveStoredAvatar = (email: string, url: string) => localStorage.setItem(`tele_avatar_${email}`, url);

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
    if (['jpg', 'png', 'gif', 'svg', 'webp'].includes(ext)) return 'image';
    if (['js', 'ts', 'json', 'html', 'css'].includes(ext)) return 'code';
    return 'document';
  };

  const mapFile = (f: RemoteFile): FileItem => ({
    id: String(f.id),
    name: f.filename,
    size: formatFileSize(f.size),
    type: getFileType(f.filename),
    uploadedAt: new Date(f.createdAt).toLocaleDateString(),
    source: f.source // Map source dari API
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
        avatarUrl: existingAvatar || u.avatar_url || null,
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
    setFiles([]);
    localStorage.removeItem('tele_user_session');
    localStorage.removeItem('token');
    showNotification('Logged out.');
  };

  // Load Hybrid Files (Cloud + Local)
  const fetchFiles = async () => {
    try {
      const allFiles = await listFiles(); // API sudah handle gabungan Cloud+Local
      setFiles(allFiles.map(mapFile));
    } catch {
      console.warn('Failed to load files');
    }
  };

  useEffect(() => {
    if (currentScreen === 'dashboard') {
      fetchFiles();
    }
  }, [currentScreen]);

  // --- HYBRID UPLOAD FLOW ---

  // 1. Trigger saat user drop/pilih file (Belum upload, tanya dulu)
  const handleFileSelect = (file: File) => {
    setPendingFile(file);
    setShowStorageOption(true); // Buka Modal Pilihan
  };

  // 2. Eksekusi setelah user memilih opsi (Cloud/Local)
  const executeUpload = async (source: 'cloud' | 'local') => {
    setShowStorageOption(false); // Tutup Modal
    const file = pendingFile;
    if (!file) return;

    try {
      showNotification(`Encrypting & Uploading to ${source.toUpperCase()}...`);

      const key = await getOrCreateKey();
      const encBlob = await encryptFile(file, key);

      // Bungkus Blob Enkripsi jadi File
      const encFile = new File([encBlob], file.name, { type: file.type });

      // Upload ke tujuan yang dipilih
      const uploaded = await uploadFile(encFile, source);

      setFiles(prev => [mapFile(uploaded), ...prev]);

      showNotification(`Securely saved to ${source === 'cloud' ? 'Cloud Server' : 'Local Browser'} ✅`);
    } catch (e: any) {
      console.error(e);
      showNotification(e.message || 'Upload failed');
    } finally {
      setPendingFile(null); // Reset pending file
    }
  };

  const handleDelete = async () => {
    if (!selectedFileId) return;
    const targetFile = files.find(f => f.id === selectedFileId);
    if (!targetFile) return;

    try {
      // Hapus berdasarkan source file tersebut
      await deleteFile(selectedFileId, targetFile.source);

      setFiles(prev => prev.filter(f => f.id !== selectedFileId));
      setSelectedFileId(null);
      showNotification('Deleted permanently 🗑️');
    } catch { showNotification('Delete failed'); }
  };

  const handleSaveProfile = (name: string, newAvatarUrl?: string | null) => {
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
          user={user}
          files={files}
          onFileClick={setSelectedFileId}
          onUploadFile={handleFileSelect} // Ubah handler ke 'handleFileSelect'
          onViewProfile={() => setCurrentScreen('profile')}
          onEditProfile={() => setShowEditProfile(true)}
          onLogout={handleLogout}
        />
      )}
      {currentScreen === 'profile' && (
        <ProfileScreen user={user} onBack={() => setCurrentScreen('dashboard')} onEditProfile={() => setShowEditProfile(true)} onLogout={handleLogout} />
      )}
      {selectedFileId && selectedFile && (
        <DetailModal
          fileId={selectedFile.id}
          fileName={selectedFile.name}
          fileSize={selectedFile.size}
          fileSource={selectedFile.source}
          onClose={() => setSelectedFileId(null)}
          onDelete={handleDelete}
        />
      )}
      {showEditProfile && (
        <EditProfileModal user={user} onClose={() => setShowEditProfile(false)} onSave={handleSaveProfile} />
      )}

      {/* STORAGE OPTION MODAL (Baru) */}
      {showStorageOption && pendingFile && (
        <StorageOptionModal
          fileName={pendingFile.name}
          onClose={() => { setShowStorageOption(false); setPendingFile(null); }}
          onSelect={executeUpload}
        />
      )}

      {showToast && <Toast message={toastMessage} onClose={() => setShowToast(false)} />}
    </>
  );
}

export default App;