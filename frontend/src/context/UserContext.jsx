import React, { createContext, useContext } from "react";

// Simulación de usuario actual (admin fijo)
const currentUser = {
  idUser: 1,
  nameUser: "admin",
  roleUser: "ADMIN"
};

const UserContext = createContext(currentUser);

export const useUser = () => useContext(UserContext);

export function UserProvider({ children }) {
  return (
    <UserContext.Provider value={currentUser}>
      {children}
    </UserContext.Provider>
  );
}