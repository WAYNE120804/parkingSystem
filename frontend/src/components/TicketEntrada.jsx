import React, { useRef, useEffect, useState } from "react";
import { useReactToPrint } from "react-to-print";
import { getParkingInfo } from "../api/parkingInfo.api";
import TicketContent from "./ticketContent.jsx";

function TicketEntrada({ movement, autoPrint = false }) {
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
    // react-to-print v3 requires a ref instead of a callback
    contentRef: componentRef
  });

  // Lanza impresión automática cuando ya se cargó la info del parqueadero
  useEffect(() => {
    if (autoPrint && parkingInfo && movement) {
      handlePrint();
    }
    // re-disparar cuando cambie el movimiento (nueva entrada)
  }, [autoPrint, parkingInfo, movement, handlePrint]);

  if (!parkingInfo) return <p>Cargando información del parqueadero...</p>;

  return (
    <div>
      <TicketContent ref={componentRef} parkingInfo={parkingInfo} movement={movement} />
      <button onClick={handlePrint}>Imprimir Ticket</button>
    </div>
  );
}

export default TicketEntrada;
