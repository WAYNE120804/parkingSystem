import React, { useState } from "react";
import { createParkingInfo, updateParkingInfo } from "../api/parkingInfo.api";

function ParkingInfoConfig({ info, onClose, onSuccess }) {
  const [form, setForm] = useState({
    parkingName: info?.parkingName || "",
    nit: info?.nit || "",
    address: info?.address || "",
    responsible: info?.responsible || "",
    footerMessage: info?.footerMessage || ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      // Validación simple antes de guardar
      if (!form.parkingName || !form.nit || !form.address || !form.responsible) {
        alert("Por favor completa todos los campos obligatorios");
        return;
      }

      if (info) {
        await updateParkingInfo(info.id, form);
        alert("Información actualizada");
      } else {
        await createParkingInfo(form);
        alert("Información creada");
      }

      onSuccess(); // refresca datos en ConfiguracionPage
      onClose();   // cierra modal
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  return (
    <div style={{
      position: "fixed",
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: "rgba(0,0,0,0.5)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 1000
    }}>
      <div style={{
        background: "#fff",
        padding: "20px",
        borderRadius: "8px",
        width: "400px",
        boxShadow: "0 4px 8px rgba(0,0,0,0.2)"
      }}>
        <h2 style={{ marginBottom: "15px" }}>
          {info ? "Editar Información del Parqueadero" : "Registrar Información del Parqueadero"}
        </h2>

        <label>Nombre:</label>
        <input
          name="parkingName"
          value={form.parkingName}
          onChange={handleChange}
          style={{ width: "100%", marginBottom: "10px" }}
        />

        <label>NIT:</label>
        <input
          name="nit"
          value={form.nit}
          onChange={handleChange}
          style={{ width: "100%", marginBottom: "10px" }}
        />

        <label>Dirección:</label>
        <input
          name="address"
          value={form.address}
          onChange={handleChange}
          style={{ width: "100%", marginBottom: "10px" }}
        />

        <label>Responsable:</label>
        <input
          name="responsible"
          value={form.responsible}
          onChange={handleChange}
          style={{ width: "100%", marginBottom: "10px" }}
        />

        <label>Mensaje al pie:</label>
        <textarea
          name="footerMessage"
          value={form.footerMessage}
          onChange={handleChange}
          style={{ width: "100%", marginBottom: "15px" }}
        />

        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button onClick={handleSave} style={{ marginRight: "10px" }}>
            Guardar
          </button>
          <button onClick={onClose}>Cancelar</button>
        </div>
      </div>
    </div>
  );
}

export default ParkingInfoConfig;