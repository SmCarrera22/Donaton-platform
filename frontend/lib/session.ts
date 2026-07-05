export type SessionUser = {
  fullName: string;
  email: string;
  createdAt: string;
};

let currentSessionUser: SessionUser | null = null;
let rememberedUsers: SessionUser[] = [];

export function getCurrentSessionUser() {
  return currentSessionUser;
}

export function setCurrentSessionUser(user: SessionUser) {
  currentSessionUser = user;
}

export function clearCurrentSessionUser() {
  currentSessionUser = null;
}

export function rememberUser(user: SessionUser) {
  const normalizedEmail = user.email.toLowerCase();
  const nextUsers = rememberedUsers.filter(
    (storedUser) => storedUser.email.toLowerCase() !== normalizedEmail,
  );

  rememberedUsers = [...nextUsers, user];
}

export function findRememberedUserByEmail(email: string) {
  return rememberedUsers.find((user) => user.email.toLowerCase() === email.toLowerCase()) ?? null;
}

// Fallback anterior con localStorage:
// window.localStorage.setItem("donaton_session", JSON.stringify(user));
// window.localStorage.getItem("donaton_session");