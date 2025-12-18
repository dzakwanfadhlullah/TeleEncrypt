// Frontend/src/api.ts

export interface User {
  id?: number;
  username?: string;
  email?: string;
  createdAt?: string;
  token?: string;
  avatar_url?: string;
}

export type FileSource = 'cloud' | 'local';

export interface RemoteFile {
  id: string;
  filename: string;
  size: number;
  mimeType: string;
  createdAt: string;
  source: FileSource; // PENTING: Penanda apakah ini file Cloud atau Local
}

// =========================================================================
// CONFIGURATIONS
// =========================================================================

// 1. CONFIG CLOUD
const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:5000";

// 2. CONFIG LOCAL STORAGE
const STORAGE_KEY_FILES_META = 'tele_local_files_meta'; 
const STORAGE_PREFIX_FILE_DATA = 'tele_local_file_data_';

// --- HELPERS ---
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem("token");
  return token ? { "Authorization": `Bearer ${token}` } : {};
}

// Helper: Convert Blob <-> Base64 (Untuk LocalStorage)
const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

const base64ToBlob = async (base64: string): Promise<Blob> => {
  const res = await fetch(base64);
  return await res.blob();
};

// =========================================================================
// BAGIAN 1: AUTHENTICATION (BACKEND ASLI)
// =========================================================================

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...getAuthHeaders(),
    ...(options.headers || {}),
  };

  const res = await fetch(`${API_BASE_URL}${path}`, { ...options, headers });

  if (!res.ok) {
    let message = `Request failed: ${res.status}`;
    try {
      const data = await res.json();
      if (data.message || data.error) message = data.message || data.error;
    } catch {}
    throw new Error(message);
  }

  if (res.status === 204) return {} as T;
  return await res.json();
}

export interface RegisterPayload { username: string; email: string; password: string; }
export interface LoginPayload { email: string; password: string; }

export async function registerUser(data: RegisterPayload): Promise<User> {
  return request<User>("/auth/register", { method: "POST", body: JSON.stringify(data) });
}

export async function loginUser(data: LoginPayload): Promise<any> {
  const response = await request<any>("/auth/login", { method: "POST", body: JSON.stringify(data) });
  const token = response.token || (response.user && response.user.token);
  if (token) localStorage.setItem("token", token);
  return response;
}

// =========================================================================
// BAGIAN 2: HYBRID FILE MANAGEMENT (CLOUD + LOCAL)
// =========================================================================

/**
 * LIST FILES: Mengambil dari Cloud DAN Local, lalu digabung.
 */
export async function listFiles(): Promise<RemoteFile[]> {
  let cloudFiles: RemoteFile[] = [];
  let localFiles: RemoteFile[] = [];

  // A. Ambil dari Cloud (Backend)
  try {
    const res = await request<any[]>("/files", { method: "GET" });
    // Map response backend ke format RemoteFile
    cloudFiles = res.map(f => ({
      id: String(f.id),
      filename: f.filename,
      size: f.size,
      mimeType: f.mimeType,
      createdAt: f.createdAt,
      source: 'cloud' as FileSource
    }));
  } catch (err) {
    console.warn("Failed to fetch cloud files, showing local only.", err);
  }

  // B. Ambil dari LocalStorage
  try {
    const raw = localStorage.getItem(STORAGE_KEY_FILES_META);
    if (raw) {
      localFiles = JSON.parse(raw).map((f: any) => ({ ...f, source: 'local' }));
    }
  } catch (err) {
    console.error("Failed to read local files", err);
  }

  // C. Gabungkan dan Sort berdasarkan tanggal (Terbaru di atas)
  const allFiles = [...cloudFiles, ...localFiles];
  return allFiles.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

/**
 * UPLOAD FILE: Bisa ke Cloud atau Local tergantung parameter 'source'
 */
export async function uploadFile(file: File, targetSource: FileSource): Promise<RemoteFile> {
  
  if (targetSource === 'cloud') {
    // --- OPSI A: UPLOAD KE CLOUD (BACKEND) ---
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch(`${API_BASE_URL}/files/upload`, {
      method: "POST",
      headers: getAuthHeaders(), 
      body: formData,
    });

    if (!res.ok) {
      let message = `Upload failed: ${res.status}`;
      try { const data = await res.json(); if(data.error) message = data.error; } catch {}
      throw new Error(message);
    }

    const uploaded = await res.json();
    return {
      id: String(uploaded.id),
      filename: uploaded.filename,
      size: uploaded.size,
      mimeType: uploaded.mimeType,
      createdAt: uploaded.createdAt,
      source: 'cloud'
    };

  } else {
    // --- OPSI B: SIMPAN DI BROWSER (LOCAL) ---
    await delay(800); // Simulasi loading
    const newId = crypto.randomUUID();
    
    // Convert Blob ke Base64 agar bisa masuk LocalStorage
    const base64Data = await blobToBase64(file);

    try {
      localStorage.setItem(`${STORAGE_PREFIX_FILE_DATA}${newId}`, base64Data);
    } catch (e) {
      throw new Error("Local Storage Penuh! File terlalu besar.");
    }

    const newFileMeta: RemoteFile = {
      id: newId,
      filename: file.name,
      size: file.size,
      mimeType: file.type,
      createdAt: new Date().toISOString(),
      source: 'local'
    };

    // Update Metadata List di LocalStorage
    const raw = localStorage.getItem(STORAGE_KEY_FILES_META);
    const currentList = raw ? JSON.parse(raw) : [];
    const newList = [newFileMeta, ...currentList];
    localStorage.setItem(STORAGE_KEY_FILES_META, JSON.stringify(newList));

    return newFileMeta;
  }
}

/**
 * DOWNLOAD: Cek source dulu, baru ambil datanya
 */
export async function downloadFile(fileId: string, source: FileSource): Promise<Blob> {
  if (source === 'cloud') {
    // Ambil dari Backend
    const res = await fetch(`${API_BASE_URL}/files/${fileId}/download`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error("Download failed from cloud.");
    return await res.blob();

  } else {
    // Ambil dari LocalStorage
    const base64Data = localStorage.getItem(`${STORAGE_PREFIX_FILE_DATA}${fileId}`);
    if (!base64Data) throw new Error("File not found in local storage.");
    return await base64ToBlob(base64Data);
  }
}

/**
 * DELETE: Cek source dulu, baru hapus
 */
export async function deleteFile(fileId: string, source: FileSource): Promise<void> {
  if (source === 'cloud') {
    // Hapus di Backend
    await request<void>(`/files/${fileId}`, { method: "DELETE" });
  } else {
    // Hapus di LocalStorage
    localStorage.removeItem(`${STORAGE_PREFIX_FILE_DATA}${fileId}`);
    
    const raw = localStorage.getItem(STORAGE_KEY_FILES_META);
    if (raw) {
      const list = JSON.parse(raw);
      const newList = list.filter((f: any) => f.id !== fileId);
      localStorage.setItem(STORAGE_KEY_FILES_META, JSON.stringify(newList));
    }
  }
}

// Avatar (Tetap simpan Base64 di browser karena backend simpel)
export function uploadAvatar(file: File): Promise<{ avatar_url: string }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve({ avatar_url: reader.result as string });
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
}