// Frontend/src/api.ts

export interface User {
  id?: number;
  username?: string;
  email?: string;
  createdAt?: string;
  token?: string;
  avatar_url?: string;
}

// 1. CONFIG KE BACKEND ASLI (Cuma buat Login/Register)
const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:5000";

// 2. CONFIG STORAGE
const STORAGE_KEY_FILES_META = 'tele_local_files_meta'; // Simpan daftar nama file
const STORAGE_PREFIX_FILE_DATA = 'tele_local_file_data_'; // Simpan isi file fisik (Base64)

// --- HELPER: CONVERT BLOB <-> BASE64 ---
// Agar file binary bisa disimpan di LocalStorage (Text only)
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

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// --- TYPES ---
export interface RegisterPayload { username: string; email: string; password: string; }
export interface LoginPayload { email: string; password: string; }
export interface RemoteFile {
  id: string; filename: string; size: number; mimeType: string; createdAt: string;
}

// =========================================================================
// BAGIAN 1: AUTHENTICATION (BACKEND ASLI)
// =========================================================================

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
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
  return await res.json();
}

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
// BAGIAN 2: FILE MANAGEMENT (PERSISTENT LOCAL STORAGE)
// =========================================================================

export async function listFiles(): Promise<RemoteFile[]> {
  await delay(300);
  console.log("[LOCAL] Reading List Files...");
  const raw = localStorage.getItem(STORAGE_KEY_FILES_META);
  return raw ? JSON.parse(raw) : [];
}

export async function uploadFile(file: File): Promise<RemoteFile> {
  await delay(1000);
  console.log("[LOCAL] Uploading & Saving Persistent:", file.name);

  // 1. Generate ID
  const newId = crypto.randomUUID();

  // 2. Convert File (Blob) ke Base64 String
  const base64Data = await blobToBase64(file);

  // 3. Simpan ISI FILE ke LocalStorage
  // Note: LocalStorage punya limit sekitar 5MB. File besar mungkin error.
  try {
    localStorage.setItem(`${STORAGE_PREFIX_FILE_DATA}${newId}`, base64Data);
  } catch (e) {
    throw new Error("Storage Penuh! File terlalu besar untuk demo lokal.");
  }

  // 4. Simpan Metadata
  const newFileMeta: RemoteFile = {
    id: newId,
    filename: file.name,
    size: file.size,
    mimeType: file.type,
    createdAt: new Date().toISOString()
  };

  const currentList = await listFiles();
  const newList = [newFileMeta, ...currentList];
  localStorage.setItem(STORAGE_KEY_FILES_META, JSON.stringify(newList));

  return newFileMeta;
}

export async function downloadFile(fileId: string): Promise<Blob> {
  await delay(500);
  console.log("[LOCAL] Retrieving file:", fileId);

  // 1. Ambil String Base64 dari LocalStorage
  const base64Data = localStorage.getItem(`${STORAGE_PREFIX_FILE_DATA}${fileId}`);

  if (!base64Data) {
    throw new Error("File corrupt or not found in local storage.");
  }

  // 2. Convert balik jadi Blob
  return await base64ToBlob(base64Data);
}

export async function deleteRemoteFile(fileId: string): Promise<void> {
  await delay(500);
  console.log("[LOCAL] Deleting:", fileId);

  // 1. Hapus Isi File
  localStorage.removeItem(`${STORAGE_PREFIX_FILE_DATA}${fileId}`);

  // 2. Hapus Metadata dari List
  const currentList = await listFiles();
  const newList = currentList.filter(f => f.id !== fileId);
  localStorage.setItem(STORAGE_KEY_FILES_META, JSON.stringify(newList));
}

// Avatar Mock (Base64 Persistence)
export function uploadAvatar(file: File): Promise<{ avatar_url: string }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve({ avatar_url: reader.result as string });
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
}