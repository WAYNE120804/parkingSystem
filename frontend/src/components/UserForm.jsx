import React, { useState } from "react";
import { createUser, updateUser } from "../api/users.api";
import { useAuth } from "../context/UserContext.jsx";

function UserForm({ mode, user, onClose, onSuccess }) {
  const [nameUser, setNameUser] = useState(user?.nameUser || "");
  const [username, setUsername] = useState(user?.username || "");
  const [roleUser, setRoleUser] = useState(user?.roleUser || "CASHIER");
  const [password, setPassword] = useState(user?.password || "");
  const { saveCredential, changePassword } = useAuth();

  const handleSubmit = async () => {
    try {
      if (mode === "create" && (!username || !password)) {
        alert("Usuario y contraseña son obligatorios");
        return;
      }
      if (!username) {
        alert("El usuario no puede estar vacío");
        return;
      }
      if (mode === "create") {
        const created = await createUser({ nameUser, roleUser });
        saveCredential({
          idUser: created.idUser,
          username,
          password,
          nameUser,
          roleUser,
          active: true
        });
      } else {
        await updateUser(user.idUser, { nameUser, roleUser });
        saveCredential({
          idUser: user.idUser,
          username: username || user.username || user.nameUser,
          password: password || user.password,
          nameUser,
          roleUser,
          active: true
        });
        if (password) {
          changePassword(user.idUser, password);
        }
      }
      alert("Usuario guardado");
      onSuccess();
      onClose();
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  return (
    <div className="modal">
      <h3>{mode === "create" ? "Registrar Usuario" : "Editar Usuario"}</h3>
      <input
        type="text"
        placeholder="Nombre visible"
        value={nameUser}
        onChange={(e) => setNameUser(e.target.value)}
      />
      <input
        type="text"
        placeholder="Usuario (login)"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder={mode === "create" ? "Contraseña" : "Nueva contraseña (opcional)"}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <select value={roleUser} onChange={(e) => setRoleUser(e.target.value)}>
        <option value="ADMIN">Admin</option>
        <option value="CASHIER">Cajero</option>
        <option value="GUARD">Guardia</option>
      </select>
      <button onClick={handleSubmit}>Guardar</button>
      <button onClick={onClose}>Cancelar</button>
    </div>
  );
}

export default UserForm;
