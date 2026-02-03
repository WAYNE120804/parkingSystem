import React, { useState, useEffect } from "react";
import { registerEntry } from "../api/movements.api";
import { getVehicleByPlate } from "../api/vehicles.api";
import { useUser } from "../context/UserContext.jsx";

// 🔑 Función utilitaria para normalizar placas
function normalizePlate(plate) {
  if (!plate) return "";
  return plate.replace(/\s+/g, "").toUpperCase();
}

function RegistrarEntradaForm({ onClose, onSuccess }) {
  const [plate, setPlate] = useState("");
  const [typeVehicle, setTypeVehicle] = useState("CAR");
  const [notes, setNotes] = useState("");
  const [vehicleExists, setVehicleExists] = useState(null);
  const currentUser = useUser();

  useEffect(() => {
    if (plate.length >= 5) {
      const normalized = normalizePlate(plate);
      getVehicleByPlate(normalized)
        .then((vehicle) => setVehicleExists(vehicle))
        .catch(() => setVehicleExists(null));
    }
  }, [plate]);

  const handleSubmit = async () => {
    try {
      const normalized = normalizePlate(plate);
      const movement = await registerEntry({
        plate: normalized,
        typeVehicle: vehicleExists ? vehicleExists.typeVehicle : typeVehicle,
        entryUserId: currentUser.idUser,
        notes
      });
      alert("Entrada registrada");
      onSuccess(movement); // enviar movimiento creado para imprimir ticket
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  return (
    <div className="modal" style={{ background: "#fff", padding: "20px" }}>
      <h3>Registrar Entrada</h3>
      <input
        type="text"
        placeholder="Placa vehículo"
        value={plate}
        onChange={(e) => setPlate(e.target.value)}
      />
      <select
        value={typeVehicle}
        onChange={(e) => setTypeVehicle(e.target.value)}
        disabled={vehicleExists !== null}
      >
        <option value="CAR">Carro</option>
        <option value="MOTO">Moto</option>
      </select>
      <textarea
        placeholder="Notas"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
      />
      <div style={{ marginTop: "10px" }}>
        <button onClick={handleSubmit}>Registrar Entrada</button>
        <button onClick={onClose} style={{ marginLeft: "10px" }}>
          Cancelar
        </button>
      </div>
    </div>
  );
}

export default RegistrarEntradaForm;