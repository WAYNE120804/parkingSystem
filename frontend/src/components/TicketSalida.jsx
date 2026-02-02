import React, { useEffect, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import { getParkingInfo } from "../api/parkingInfo.api";

function formatCOP(amountCents) {
  if (amountCents == null) return "-";
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0
  }).format(amountCents / 100);
}

function TicketSalida({ movement, autoPrint = false }) {
  const [parkingInfo, setParkingInfo] = useState(null);
  const componentRef = useRef();

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
    contentRef: componentRef
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
      <h3>{parkingInfo.parkingName}</h3>
      <p>NIT: {parkingInfo.nit}</p>
      <p>Dirección: {parkingInfo.address}</p>
      <hr />
      <p>Ticket: {movement.ticketNumber}</p>
      <p>Placa: {movement.vehicle?.plateVehicle}</p>
      <p>Tipo: {movement.vehicle?.typeVehicle}</p>
      <p>Entrada: {new Date(movement.entryTime).toLocaleString()}</p>
      <p>Salida: {new Date(movement.exitTime).toLocaleString()}</p>
      <p>Horas cobradas: {payment?.ratePerHourCents ? Math.round((payment.amountCents ?? 0) / payment.ratePerHourCents) : "-"}</p>
      <p>Tarifa/hora: {payment?.ratePerHourCents ? formatCOP(payment.ratePerHourCents) : "-"}</p>
      <p>Total: {formatCOP(payment?.amountCents)}</p>
      <p>Método: {payment?.method}</p>
      <hr />
      <p>{parkingInfo.footerMessage}</p>
    </div>
  );
}

export default TicketSalida;
