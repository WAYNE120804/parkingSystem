import React, { useEffect, useState } from "react";
import { exitMovement } from "../api/movements.api";
import { previewPayment } from "../api/payments.api.js";
import { useUser } from "../context/UserContext.jsx";

function RegistrarSalidaForm({ movement, onClose, onSuccess }) {
  const [notes, setNotes] = useState("");
  const [method, setMethod] = useState("CASH");
  const [preview, setPreview] = useState(null); // valor en centavos calculado por el backend
  const [errorPreview, setErrorPreview] = useState(false);
  const [loadingPreview, setLoadingPreview] = useState(true);
  const currentUser = useUser();

  const handleSubmit = async () => {
    try {
      const updatedMovement = await exitMovement(movement.idMovement, {
        exitUserId: currentUser.idUser,
        paidByUserId: currentUser.idUser,
        method,
        notes
      });
      alert("Salida registrada");
      onClose();
      onSuccess?.(updatedMovement);
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  // Calcula el total a pagar sin registrar la salida
  useEffect(() => {
    if (!movement?.idMovement) {
      setPreview(null);
      setErrorPreview(true);
      setLoadingPreview(false);
      return;
    }

    setLoadingPreview(true);

    previewPayment(movement.idMovement)
      .then((data) => {
        setPreview(data?.amountCents ?? null);
        setErrorPreview(false);
      })
      .catch((err) => {
        console.error("previewPayment failed", err);
        setPreview(null);
        setErrorPreview(true);
      })
      .finally(() => setLoadingPreview(false));
  }, [movement?.idMovement]);

  return (
    <div className="modal" style={{ background: "#fff", padding: "20px" }}>
      <h3>Registrar Salida</h3>
      <p>
        <strong>Placa:</strong> {movement.vehicle?.plateVehicle}
      </p>
      <p>
        <strong>Ticket:</strong> {movement.ticketNumber}
      </p>
      <p>
  <strong>Total a pagar:</strong>{" "}
  {loadingPreview
    ? "Calculando..."
    : errorPreview || preview === null
    ? "No se pudo calcular"
    : `$ ${new Intl.NumberFormat("es-CO").format(preview)} COP`}
</p>

      <select value={method} onChange={(e) => setMethod(e.target.value)}>
        <option value="CASH">Efectivo</option>
        <option value="CARD">Tarjeta</option>
      </select>

      <textarea
        placeholder="Notas"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
      />

      <div style={{ marginTop: "10px" }}>
        <button onClick={handleSubmit}>Confirmar salida</button>
        <button onClick={onClose} style={{ marginLeft: "10px" }}>
          Cancelar
        </button>
      </div>
    </div>
  );
}

export default RegistrarSalidaForm;
