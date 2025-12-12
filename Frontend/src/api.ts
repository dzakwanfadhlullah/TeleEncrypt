// Frontend/src/api.ts

export interface User {
  id?: number;
  username?: string;
  email?: string;
  createdAt?: string;
  token?: string;
  avatar_url?: string;
}

// 1. CONFIG KE BACKEND ASLI
const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:5000";

// --- HELPERS ---
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem("token");
  return token ? { "Authorization": `Bearer ${token}` } : {};
}

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

  // Handle No Content (misal saat delete)
  if (res.status === 204) return {} as T;

  return await res.json();
}

// --- TYPES ---
export interface RegisterPayload { username: string; email: string; password: string; }
export interface LoginPayload { email: string; password: string; }
export interface RemoteFile {
  id: string; filename: string; size: number; mimeType: string; createdAt: string;
}

// =========================================================================
// AUTHENTICATION
// =========================================================================

export async function registerUser(data: RegisterPayload): Promise<User> {
  return request<User>("/auth/register", { method: "POST", body: JSON.stringify(data) });
}

export async function loginUser(data: LoginPayload): Promise<any> {
  const response = await request<any>("/auth/login", { method: "POST", body: JSON.stringify(data) });
  // Simpan token untuk request selanjutnya
  const token = response.token || (response.user && response.user.token);
  if (token) localStorage.setItem("token", token);
  return response;
}

// =========================================================================
// FILE MANAGEMENT (REAL BACKEND)
// =========================================================================

export async function listFiles(): Promise<RemoteFile[]> {
  // GET /files
  return request<RemoteFile[]>("/files", { method: "GET" });
}

export async function uploadFile(file: File): Promise<RemoteFile> {
  // POST /files/upload dengan Multipart Form Data
  const formData = new FormData();
  formData.append("file", file);

  // Khusus upload, jangan set Content-Type manual, biarkan browser set Boundary
  const headers = getAuthHeaders(); 

  const res = await fetch(`${API_BASE_URL}/files/upload`, {
    method: "POST",
    headers: headers, 
    body: formData,
  });

  if (!res.ok) {
    let message = `Upload failed: ${res.status}`;
    try { const data = await res.json(); if(data.error) message = data.error; } catch {}
    throw new Error(message);
  }

  return await res.json();
}

export async function downloadFile(fileId: string): Promise<Blob> {
  // GET /files/:id/download
  // Kita pakai fetch manual agar bisa ambil Blob
  const res = await fetch(`${API_BASE_URL}/files/${fileId}/download`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  if (!res.ok) {
    throw new Error("Download failed or file not found on server.");
  }

  return await res.blob();
}

export async function deleteRemoteFile(fileId: string): Promise<void> {
  // DELETE /files/:id
  return request<void>(`/files/${fileId}`, { method: "DELETE" });
}

// =========================================================================
// AVATAR (LOCAL MOCK ONLY)
// =========================================================================
// Backend belum support avatar, jadi kita simpan di Browser saja biar UI bagus
export function uploadAvatar(file: File): Promise<{ avatar_url: string }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve({ avatar_url: reader.result as string });
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
}