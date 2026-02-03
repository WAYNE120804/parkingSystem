import React, { useEffect, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import { getParkingInfo } from "../api/parkingInfo.api";
import { useSettings } from "../context/SettingsContext.jsx";

function formatCOP(amount) {
  if (amount == null) return "-";
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    currencyDisplay: "code",
    minimumFractionDigits: 0
  }).format(amount);
}

function TicketSalida({ movement, autoPrint = false }) {
  const [parkingInfo, setParkingInfo] = useState(null);
  const componentRef = useRef();
  const { logoUrl } = useSettings();
  const methodLabels = {
  CASH: "Efectivo",
  CARD: "Tarjeta",
  transfer: "Transferencia",
  nequi: "Nequi",
  daviplata: "Daviplata"
};


  useEffect(() => {
    const fetchInfo = async () => {
      try {
        const info = await getParkingInfo();
        setParkingInfo(info);
      } catch (err) {
        console.error("Error al cargar info del parqueadero", err);
      }
    };
    fetchInfo();
  }, []);

  const handlePrint = useReactToPrint({
    // Compatibilidad v2/v3
    contentRef: componentRef,
    content: () => componentRef.current
  });

  useEffect(() => {
    if (autoPrint && parkingInfo && movement) {
      handlePrint();
    }
    // re-disparar cuando cambie el movimiento (nueva salida)
  }, [autoPrint, parkingInfo, movement, handlePrint]);

  if (!parkingInfo) return <p>Cargando información del parqueadero...</p>;

  const payment = movement.payment;

  return (
  <div>
    {/* Contenido del recibo: este sí se imprime */}
    <div
      ref={componentRef}
      style={{
        padding: "20px",
        background: "#fff",
        color: "#000",
        width: "300px",
        border: "1px solid #000",
        fontFamily: "Arial, sans-serif",
        fontSize: "14px",
        lineHeight: "1.4"
      }}
    >
      {logoUrl && (
        <div style={{ textAlign: "center", marginBottom: "12px" }}>
          <img
            src={logoUrl}
            alt="Logo Parqueadero"
            style={{ height: "60px", width: "auto", objectFit: "contain" }}
          />
        </div>
      )}
      <h3>{parkingInfo.parkingName}</h3>
      <p>NIT: {parkingInfo.nit}</p>
      <p>Dirección: {parkingInfo.address}</p>
      <hr />
      <p>Ticket: {movement.ticketNumber}</p>
      <p>Placa: {movement.vehicle?.plateVehicle}</p>
      <p>Tipo: {movement.vehicle?.typeVehicle}</p>
      <p>Entrada: {new Date(movement.entryTime).toLocaleString()}</p>
      <p>Salida: {new Date(movement.exitTime).toLocaleString()}</p>
      <p>
        Horas cobradas:{" "}
        {payment?.ratePerHourCents
          ? Math.round((payment.amountCents ?? 0) / payment.ratePerHourCents)
          : "-"}
      </p>
      <p>
        Tarifa/hora:{" "}
        {payment?.ratePerHourCents ? formatCOP(payment.ratePerHourCents) : "-"}
      </p>
      <p>Total: {formatCOP(payment?.amountCents)}</p>
      <p>Método: {methodLabels[payment?.method] ?? payment?.method}</p>
      <hr />
      <p>{parkingInfo.footerMessage}</p>
    </div>

    {/* Botón fuera del recibo: este NO se imprime */}
    <div style={{ marginTop: "12px" }}>
      <button onClick={handlePrint}>Imprimir</button>
    </div>
  </div>
);
}

export default TicketSalida;
