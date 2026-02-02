import React, { useState } from "react";
import { createUser, updateUser } from "../api/users.api";

function UserForm({ mode, user, onClose, onSuccess }) {
  const [nameUser, setNameUser] = useState(user?.nameUser || "");
  const [roleUser, setRoleUser] = useState(user?.roleUser || "CASHIER");

  const handleSubmit = async () => {
    try {
      if (mode === "create") {
        await createUser({ nameUser, roleUser });
      } else {
        await updateUser(user.idUser, { nameUser, roleUser });
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
        placeholder="Nombre"
        value={nameUser}
        onChange={(e) => setNameUser(e.target.value)}
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