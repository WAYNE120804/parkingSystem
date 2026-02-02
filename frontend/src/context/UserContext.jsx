import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "authUsers";
const CURRENT_KEY = "currentUser";

function loadAuthUsers() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function persistAuthUsers(list) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

function seedDefaultAdmin() {
  const users = loadAuthUsers();
  const exists = users.some((u) => u.username === "admin");
  if (!exists) {
    users.push({
      idUser: 1,
      username: "admin",
      password: "admin123456",
      nameUser: "admin",
      roleUser: "ADMIN",
      active: true
    });
    persistAuthUsers(users);
  }
}

const UserContext = createContext({
  user: null,
  login: () => {},
  logout: () => {},
  saveCredential: () => {},
  deleteCredential: () => {},
  changePassword: () => {},
  authUsers: []
});

export function UserProvider({ children }) {
  const [authUsers, setAuthUsers] = useState(() => {
    seedDefaultAdmin();
    return loadAuthUsers();
  });
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem(CURRENT_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  // helpers
  const saveCredential = (cred) => {
    setAuthUsers((prev) => {
      const next = prev.filter((u) => u.idUser !== cred.idUser && u.username !== cred.username);
      next.push(cred);
      persistAuthUsers(next);
      return next;
    });
  };

  const deleteCredential = (idUser) => {
    setAuthUsers((prev) => {
      const next = prev.filter((u) => u.idUser !== idUser);
      persistAuthUsers(next);
      return next;
    });
    if (user?.idUser === idUser) {
      logout();
    }
  };

  const changePassword = (idUser, newPassword) => {
    setAuthUsers((prev) => {
      const next = prev.map((u) =>
        u.idUser === idUser ? { ...u, password: newPassword } : u
      );
      persistAuthUsers(next);
      return next;
    });
  };

  const login = (username, password) => {
    const stored = loadAuthUsers();
    const match = stored.find(
      (u) => u.username === username && u.password === password && u.active !== false
    );
    if (!match) {
      throw new Error("Usuario o contraseña incorrectos");
    }
    const logged = {
      idUser: match.idUser,
      nameUser: match.nameUser,
      roleUser: match.roleUser,
      username: match.username
    };
    setUser(logged);
    localStorage.setItem(CURRENT_KEY, JSON.stringify(logged));
    // sync in-memory list
    setAuthUsers(stored);
    return logged;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(CURRENT_KEY);
  };

  const value = useMemo(
    () => ({
      user,
      authUsers,
      login,
      logout,
      saveCredential,
      deleteCredential,
      changePassword
    }),
    [user, authUsers]
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export const useAuth = () => useContext(UserContext);
export const useUser = () => useContext(UserContext).user;
