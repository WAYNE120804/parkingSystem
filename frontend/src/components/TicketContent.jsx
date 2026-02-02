import React, { forwardRef } from "react";

const TicketContent = forwardRef(({ parkingInfo, movement }, ref) => {
  return (
    <div
      ref={ref}
      style={{
        padding: "20px",
        background: "#fff",   // fondo blanco
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
      <p>Placa: {movement.vehicle?.plateVehicle}</p>
      <p>Tipo: {movement.vehicle.typeVehicle}</p>
      <p>Entrada: {new Date(movement.entryTime).toLocaleString()}</p>
      <p>Notas: {movement.notes}</p>
      {movement.exitTime && (
        <>
          <p>Salida: {new Date(movement.exitTime).toLocaleString()}</p>
          <p>Total: ${movement.total}</p>
        </>
      )}
      <hr />
      <p>{parkingInfo.footerMessage}</p>
    </div>
  );
});

export default TicketContent;