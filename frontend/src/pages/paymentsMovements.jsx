import React, { useEffect, useRef, useState } from "react";
import { getAllMovements } from "../api/movements.api";
import { useReactToPrint } from "react-to-print";
import { useNavigate } from "react-router-dom";
import { useAuth, useUser } from "../context/UserContext.jsx";
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


const methodLabels = {
  CASH: "Efectivo",
  CARD: "Tarjeta",
  transfer: "Transferencia",
  nequi: "Nequi",
  daviplata: "Daviplata"
};

function PaymentsPage({ autoPrint = false }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // filtros
  const [filterStart, setFilterStart] = useState("");
  const [filterEnd, setFilterEnd] = useState("");
  const [filterHourStart, setFilterHourStart] = useState("");
  const [filterHourEnd, setFilterHourEnd] = useState("");

  const navigate = useNavigate();
  const currentUser = useUser();
  const { logout } = useAuth();
  const { logoUrl } = useSettings();

  const componentRef = useRef();

  // definir handlePrint ANTES de usarlo
  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    content: () => componentRef.current
  });

  useEffect(() => {
    if (autoPrint) {
      handlePrint();
    }
  }, [autoPrint]); // 👈 ya no da error de inicialización

  const fetchMovements = async () => {
    try {
      setLoading(true);
      const movements = await getAllMovements();
      setData(movements);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovements();
  }, []);

  // aplicar filtros
  const filteredData = data.filter((mov) => {
    if (!mov.exitTime || !mov.payment) return false; // solo pagos con salida

    const exitDate = new Date(mov.exitTime);

    if (filterStart && exitDate < new Date(filterStart)) return false;
    if (filterEnd && exitDate > new Date(filterEnd)) return false;

    if (filterHourStart) {
      const hourStart = parseInt(filterHourStart, 10);
      if (exitDate.getHours() < hourStart) return false;
    }
    if (filterHourEnd) {
      const hourEnd = parseInt(filterHourEnd, 10);
      if (exitDate.getHours() > hourEnd) return false;
    }

    return true;
  });

  // calcular total
  const total = filteredData.reduce(
    (sum, mov) => sum + (mov.payment?.amountCents ?? 0),
    0
  );

  return (
    <div style={{ padding: "20px" }}>
      <h2>Informe de Pagos</h2>
      <p>Bienvenido {currentUser.nameUser}</p>

      {/* Botones de navegación */}
      <div
        style={{
          marginBottom: "20px",
          display: "flex",
          alignItems: "center",
          gap: "10px",
          flexWrap: "wrap"
        }}
      >
        {logoUrl && (
          <img
            src={logoUrl}
            alt="Logo Parqueadero"
            style={{ height: "60px", width: "auto", objectFit: "contain" }}
          />
        )}
        <button onClick={() => navigate("/entries")}>Ir a Entradas</button>
        {currentUser.roleUser === "ADMIN" && (
          <button
            onClick={() => navigate("/config")}
            style={{ marginLeft: "10px" }}
          >
            Ir a Configuración
          </button>
        )}
        <button
          onClick={() => navigate("/movements")}
          style={{ marginLeft: "10px" }}
        >
          Ir a Movimientos
        </button>
        <button onClick={() => { logout(); navigate("/login", { replace: true }); }} style={{ marginLeft: "10px" }}>Cerrar sesión</button>
      </div>

      {/* Filtros */}
      <div style={{ marginBottom: "20px" }}>
        <label>
          Fecha desde:
          <input
            type="date"
            value={filterStart}
            onChange={(e) => setFilterStart(e.target.value)}
          />
        </label>
        <label>
          hasta:
          <input
            type="date"
            value={filterEnd}
            onChange={(e) => setFilterEnd(e.target.value)}
          />
        </label>

        <label style={{ marginLeft: "20px" }}>
          Hora desde:
          <input
            type="number"
            min="0"
            max="23"
            value={filterHourStart}
            onChange={(e) => setFilterHourStart(e.target.value)}
          />
        </label>
        <label>
          hasta:
          <input
            type="number"
            min="0"
            max="23"
            value={filterHourEnd}
            onChange={(e) => setFilterHourEnd(e.target.value)}
          />
        </label>
      </div>

      {loading && <p>Cargando pagos...</p>}
      {error && <p>Error: {error}</p>}

      {/* Informe imprimible */}
      <div ref={componentRef}>
        {!loading && !error && (
          <table
            border="1"
            cellPadding="8"
            style={{ borderCollapse: "collapse", width: "100%" }}
          >
            <thead>
              <tr>
                <th>ID</th>
                <th>Placa</th>
                <th>Ticket</th>
                <th>Entrada</th>
                <th>Salida</th>
                <th>Total</th>
                <th>Método</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((mov) => (
                <tr key={mov.idMovement}>
                  <td>{mov.idMovement}</td>
                  <td>{mov.vehicle?.plateVehicle}</td>
                  <td>{mov.ticketNumber}</td>
                  <td>{new Date(mov.entryTime).toLocaleString()}</td>
                  <td>{new Date(mov.exitTime).toLocaleString()}</td>
                  <td>{formatCOP(mov.payment?.amountCents)}</td>
                  <td>{methodLabels[mov.payment?.method] ?? mov.payment?.method}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <h3 style={{ marginTop: "20px" }}>
          Total Recogido: {formatCOP(total)}
        </h3>
      </div>

      {/* Botón fuera del informe */}
      <div style={{ marginTop: "12px" }}>
        <button onClick={handlePrint}>Imprimir Informe</button>
      </div>
    </div>
  );
}

export default PaymentsPage;
