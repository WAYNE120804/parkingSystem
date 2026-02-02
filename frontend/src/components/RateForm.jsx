import React, { useState } from "react";
import { updateRate } from "../api/rates.api"; // asegúrate de tener este service

function RateForm({ rate, onClose, onSuccess }) {
  const [pricePerHourCents, setPricePerHourCents] = useState(rate?.pricePerHourCents || 0);

  const handleSubmit = async () => {
    try {
      await updateRate(rate.idRate, { pricePerHourCents: parseInt(pricePerHourCents, 10) });
      alert("Tarifa actualizada");
      onSuccess(); // refresca la tabla
      onClose();   // cierra el modal
    } catch (err) {
      alert("Error al actualizar tarifa: " + err.message);
    }
  };

  return (
    <div className="modal">
      <h3>Editar Tarifa</h3>
      <p>Tipo de vehículo: <strong>{rate.vehicleType}</strong></p>
      <input
        type="number"
        placeholder="Precio por hora (cents)"
        value={pricePerHourCents}
        onChange={(e) => setPricePerHourCents(e.target.value)}
      />
      <button onClick={handleSubmit}>Guardar</button>
      <button onClick={onClose}>Cancelar</button>
    </div>
  );
}

export default RateForm;