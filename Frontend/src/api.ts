// Frontend/src/api.ts

export interface User {
  id?: number;
  username?: string;
  email: string;
  createdAt?: string;
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
      // kalau parse gagal, biarin pakai pesan default
    }
    throw new Error(message);
  }

  // kalau backend balikin 204 No Content
  if (res.status === 204) {
    return {} as T;
  }

  return (await res.json()) as T;
}

// POST /users/email -> ambil user by email (buat login)
export async function getUserByEmail(email: string): Promise<User> {
  console.log("[API] getUserByEmail:", email);

  return request<User>("/users/email", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}

// POST /auth/registrasi -> daftar user baru
export async function registerUser(data: {
  username: string;
  email: string;
  password: string;
}): Promise<User> {
  console.log("[API] registerUser:", data);

  return request<User>("/auth/registrasi", {
    method: "POST",
    body: JSON.stringify(data),
  });
}
