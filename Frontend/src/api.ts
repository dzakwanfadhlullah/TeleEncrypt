// Frontend/src/api.ts

export interface User {
  id?: number;
  username?: string;
  email?: string;
  createdAt?: string;
  token?: string;
}

const API_BASE_URL =
  import.meta.env.VITE_API_URL ?? "http://localhost:5000";

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  if (!res.ok) {
    let message = `Request failed with status ${res.status}`;
    try {
      const data = await res.json();
      if ((data as any).message) {
        message = (data as any).message;
      }
    } catch {
      // kalau parse gagal, pakai pesan default
    }
    throw new Error(message);
  }

  // kalau backend balikin 204 No Content
  if (res.status === 204) {
    return {} as T;
  }

  return (await res.json()) as T;
}

export interface RegisterPayload {
  username: string;
  email: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

// POST /auth/register -> daftar user baru
export async function registerUser(data: RegisterPayload): Promise<User> {
  console.log("[API] registerUser:", data);

  return request<User>("/auth/register", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// POST /auth/login -> login user
export async function loginUser(data: LoginPayload): Promise<any> {
  console.log("[API] loginUser:", data);

  return request<any>("/auth/login", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// Opsional: masih disimpan kalau mau dipakai BE / debug
export async function getUserByEmail(email: string): Promise<User> {
  console.log("[API] getUserByEmail:", email);

  return request<User>("/users/email", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}
