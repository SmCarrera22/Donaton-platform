import type { AuthSession } from "@/types/user";

const SESSION_KEY = "donaton_session";

export function saveSession(session: AuthSession) {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function getSession(): AuthSession | null {
  if (typeof window === "undefined") return null;

  const rawSession = sessionStorage.getItem(SESSION_KEY);

  if (!rawSession) return null;

  try {
    return JSON.parse(rawSession) as AuthSession;
  } catch {
    clearSession();
    return null;
  }
}

export function clearSession() {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(SESSION_KEY);
}

export function getToken() {
  return getSession()?.token ?? null;
}

export function isAuthenticated() {
  return Boolean(getToken());
}