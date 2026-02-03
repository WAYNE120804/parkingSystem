import React, { useEffect, useState } from "react";
import { getAllMovements } from "../api/movements.api";
import TicketSalida from "../components/TicketSalida.jsx";
import { useNavigate } from "react-router-dom";
import { useAuth, useUser } from "../context/UserContext.jsx";
import { useSettings } from "../context/SettingsContext.jsx";

function MovementsPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  

  const [selectedMovement, setSelectedMovement] = useState(null);

  // filtros
  const [filterEntryStart, setFilterEntryStart] = useState("");
  const [filterEntryEnd, setFilterEntryEnd] = useState("");
  const [filterExitStart, setFilterExitStart] = useState("");
  const [filterExitEnd, setFilterExitEnd] = useState("");
  const [filterStatus, setFilterStatus] = useState(""); // activo | salida | todos

  const navigate = useNavigate();
  const currentUser = useUser();
  const { logout } = useAuth();
  const { logoUrl } = useSettings();

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

  function formatCOP(amount) {
  if (amount == null) return "-";
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    currencyDisplay: "code",
    minimumFractionDigits: 0
  }).format(amount);
}

  useEffect(() => {
    fetchMovements();
  }, []);

  // aplicar filtros
  const filteredData = data.filter((mov) => {
    const entryDate = new Date(mov.entryTime);
    const exitDate = mov.exitTime ? new Date(mov.exitTime) : null;

    if (filterEntryStart && entryDate < new Date(filterEntryStart)) return false;
    if (filterEntryEnd && entryDate > new Date(filterEntryEnd)) return false;
    if (filterExitStart && (!exitDate || exitDate < new Date(filterExitStart))) return false;
    if (filterExitEnd && (!exitDate || exitDate > new Date(filterExitEnd))) return false;

    if (filterStatus === "activo" && mov.exitTime) return false;
    if (filterStatus === "salida" && !mov.exitTime) return false;

    return true;
  });

  return (
    <div style={{ padding: "20px" }}>
      <h2>Movimientos del Parqueadero</h2>
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
        <button onClick={() => navigate("/payments")} style={{ marginLeft: "10px" }}>Ver Pagos</button>
        <button onClick={() => { logout(); navigate("/login", { replace: true }); }} style={{ marginLeft: "10px" }}>Cerrar sesión</button>
      </div>

      {/* Filtros */}
      <div style={{ marginBottom: "20px" }}>
        <label>
          Entrada desde:
          <input type="date" value={filterEntryStart} onChange={(e) => setFilterEntryStart(e.target.value)} />
        </label>
        <label>
          hasta:
          <input type="date" value={filterEntryEnd} onChange={(e) => setFilterEntryEnd(e.target.value)} />
        </label>

        <label style={{ marginLeft: "20px" }}>
          Salida desde:
          <input type="date" value={filterExitStart} onChange={(e) => setFilterExitStart(e.target.value)} />
        </label>
        <label>
          hasta:
          <input type="date" value={filterExitEnd} onChange={(e) => setFilterExitEnd(e.target.value)} />
        </label>

        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} style={{ marginLeft: "20px" }}>
          <option value="">Todos</option>
          <option value="activo">Activos</option>
          <option value="salida">Con salida</option>
        </select>
      </div>

      {loading && <p>Cargando movimientos...</p>}
      {error && <p>Error: {error}</p>}

      {!loading && !error && (
        <table border="1" cellPadding="8" style={{ borderCollapse: "collapse", width: "100%" }}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Placa</th>
              <th>Tipo Vehículo</th>
              <th>Ticket</th>
              <th>Entrada</th>
              <th>Salida</th>
              <th>Total</th>
              <th>Usuario</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((mov) => (
              <tr key={mov.idMovement}>
                <td>{mov.idMovement}</td>
                <td>{mov.vehicle?.plateVehicle}</td>
                <td>{mov.vehicle?.typeVehicle}</td>
                <td>{mov.ticketNumber}</td>
                <td>{new Date(mov.entryTime).toLocaleString()}</td>
                <td>{mov.exitTime ? new Date(mov.exitTime).toLocaleString() : "-"}</td>
                <td>{mov.payment?.amountCents ? formatCOP (mov.payment?.amountCents) : "-"}</td>
                <td>{mov.entryUser?.nameUser}</td>
                <td>
                  {mov.exitTime ? (
                    <button onClick={() => setSelectedMovement(mov)}>Imprimir Recibo</button>
                  ) : (
                    <span>Activo</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Modal de impresión */}
      {selectedMovement && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000
          }}
          onClick={() => setSelectedMovement(null)}
        >
          <div onClick={(e) => e.stopPropagation()}>
            <TicketSalida movement={selectedMovement} autoPrint />
          </div>
        </div>
      )}
    </div>
  );
}

export default MovementsPage;
