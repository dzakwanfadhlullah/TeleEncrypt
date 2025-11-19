import React, { useState } from 'react';
import { MatrixBackground } from './components/MatrixBackground';
import { WelcomePortal } from './components/screens/WelcomePortal';
import { Authentication } from './components/screens/Authentication';
import { Dashboard } from './components/screens/Dashboard';
import { ProfileScreen } from './components/screens/ProfileScreen';
import { DetailModal } from './components/screens/DetailModal';
import { EditProfileModal } from './components/modals/EditProfileModal';
import { Toast } from './components/design-system/Toast';

type Screen = 'welcome' | 'login' | 'register' | 'dashboard' | 'profile';

interface FileItem {
  id: string;
  name: string;
  size: string;
  type: 'document' | 'image' | 'code';
  uploadedAt: string;
}

function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('welcome');
  const [selectedFileId, setSelectedFileId] = useState<string | null>(null);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [user, setUser] = useState({ 
    name: 'Sarah Chen', 
    email: 'sarah@example.com',
    authMethod: 'Logged in with Google OAuth 2.0',
    joinedDate: 'November 2025'
  });

  const [files, setFiles] = useState<FileItem[]>([
    { id: '1', name: 'quarterly-report.pdf', size: '2.4 MB', type: 'document', uploadedAt: 'Nov 15, 2025' },
    { id: '2', name: 'product-screenshot.png', size: '1.8 MB', type: 'image', uploadedAt: 'Nov 14, 2025' },
    { id: '3', name: 'api-documentation.txt', size: '156 KB', type: 'code', uploadedAt: 'Nov 12, 2025' },
    { id: '4', name: 'financial-data.xlsx', size: '890 KB', type: 'document', uploadedAt: 'Nov 10, 2025' },
    { id: '5', name: 'security-audit.pdf', size: '3.2 MB', type: 'document', uploadedAt: 'Nov 8, 2025' },
    { id: '6', name: 'logo-design.svg', size: '245 KB', type: 'image', uploadedAt: 'Nov 5, 2025' },
  ]);

  const handleLogin = (email: string, password: string) => {
    // Mock login
    setUser({ 
      name: 'Sarah Chen', 
      email: email,
      authMethod: 'Logged in with Google OAuth 2.0',
      joinedDate: 'November 2025'
    });
    setCurrentScreen('dashboard');
    showNotification('Welcome back! 🎉');
  };

  const handleLogout = () => {
    setCurrentScreen('welcome');
    showNotification('Logged out successfully 👋');
  };

  const showNotification = (message: string) => {
    setToastMessage(message);
    setShowToast(true);
  };

  const handleFileClick = (fileId: string) => {
    setSelectedFileId(fileId);
    showNotification('File decrypted locally ✨');
  };

  const handleUploadFile = (file: File) => {
    // Mock file upload - add to files list
    const newFile: FileItem = {
      id: Date.now().toString(),
      name: file.name,
      size: formatFileSize(file.size),
      type: getFileType(file.name),
      uploadedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    };
    
    setFiles([newFile, ...files]);
    showNotification('File encrypted and uploaded ✅');
  };

  const handleDeleteFile = () => {
    if (selectedFileId) {
      setFiles(files.filter(f => f.id !== selectedFileId));
      setSelectedFileId(null);
      showNotification('File deleted successfully 🗑️');
    }
  };

  const handleSaveProfile = (name: string) => {
    setUser({ ...user, name });
    showNotification('Profile updated successfully ✅');
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const getFileType = (fileName: string): 'document' | 'image' | 'code' => {
    const ext = fileName.split('.').pop()?.toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp'].includes(ext || '')) return 'image';
    if (['js', 'ts', 'jsx', 'tsx', 'txt', 'json', 'html', 'css'].includes(ext || '')) return 'code';
    return 'document';
  };

  const selectedFile = files.find(f => f.id === selectedFileId);

  return (
    <>
      {/* Matrix Background - Always present */}
      <MatrixBackground />

      {/* Screen Router */}
      {currentScreen === 'welcome' && (
        <WelcomePortal onNavigate={setCurrentScreen} />
      )}

      {currentScreen === 'login' && (
        <Authentication 
          mode="login"
          onBack={() => setCurrentScreen('welcome')}
          onLogin={handleLogin}
        />
      )}

      {currentScreen === 'register' && (
        <Authentication 
          mode="register"
          onBack={() => setCurrentScreen('welcome')}
          onLogin={handleLogin}
        />
      )}

      {currentScreen === 'dashboard' && (
        <Dashboard 
          user={user}
          files={files}
          onFileClick={handleFileClick}
          onUploadFile={handleUploadFile}
          onViewProfile={() => setCurrentScreen('profile')}
          onEditProfile={() => setShowEditProfile(true)}
          onLogout={handleLogout}
        />
      )}

      {currentScreen === 'profile' && (
        <ProfileScreen
          user={user}
          onBack={() => setCurrentScreen('dashboard')}
          onEditProfile={() => setShowEditProfile(true)}
          onLogout={handleLogout}
        />
      )}

      {/* Detail Modal Overlay */}
      {selectedFileId && selectedFile && (
        <DetailModal
          fileName={selectedFile.name}
          fileSize={selectedFile.size}
          onClose={() => setSelectedFileId(null)}
          onDelete={handleDeleteFile}
        />
      )}

      {/* Edit Profile Modal */}
      {showEditProfile && (
        <EditProfileModal
          user={user}
          onClose={() => setShowEditProfile(false)}
          onSave={handleSaveProfile}
        />
      )}

      {/* Toast Notifications */}
      {showToast && (
        <Toast
          message={toastMessage}
          onClose={() => setShowToast(false)}
        />
      )}
    </>
  );
}

export default App;