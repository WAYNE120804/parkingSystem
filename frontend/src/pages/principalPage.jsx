import React, { useEffect, useState } from "react";
import {
  getActiveMovements,
  cancelActiveMovement
} from "../api/movements.api";
import RegistrarEntradaForm from "../components/registrarEntradaForm";
import RegistrarSalidaForm from "../components/registrarSalidaForm";
import TicketEntrada from "../components/ticketEntrada.jsx";
import TicketSalida from "../components/TicketSalida.jsx";
import { useNavigate } from "react-router-dom";
import { useAuth, useUser } from "../context/UserContext.jsx";


function PrincipalPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showEntradaForm, setShowEntradaForm] = useState(false);
  const [showSalidaForm, setShowSalidaForm] = useState(false);
  const [selectedMovement, setSelectedMovement] = useState(null);
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [ticketType, setTicketType] = useState("entrada"); 

   const [searchTerm, setSearchTerm] = useState("");

  const navigate = useNavigate();
  const currentUser = useUser();
  const { logout } = useAuth();

  const fetchMovements = async () => {
    try {
      setLoading(true);
      const movements = await getActiveMovements();
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

  const handleCancel = async (id) => {
    try {
      await cancelActiveMovement(id);
      alert("Movimiento cancelado");
      fetchMovements();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Bienvenido {currentUser.nameUser}</h2>

      {/* Botones superiores */}
      <div style={{ marginBottom: "20px" }}>
        <button onClick={() => setShowEntradaForm(true)}>Registrar Entrada</button>

        <button onClick={() => navigate("/movements")}  style={{ marginLeft: "10px" }}>Ver Movimientos</button>
        <button onClick={() => navigate("/payments")} style={{ marginLeft: "10px" }}>Ver Pagos</button>

        {currentUser.roleUser === "ADMIN" && (
          <button
            onClick={() => navigate("/config")}
            style={{ marginLeft: "10px" }}
          >
            Ir a Configuración
          </button>
        )}
        <button onClick={() => { logout(); navigate("/login", { replace: true }); }} style={{ marginLeft: "10px" }}>
          Cerrar sesión
        </button>
      </div>

      {/* Modal Entrada */}
      {showEntradaForm && (
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
          onClick={() => setShowEntradaForm(false)}
        >
          <div onClick={(e) => e.stopPropagation()}>
            <RegistrarEntradaForm
              onClose={() => setShowEntradaForm(false)}
              onSuccess={(movement) => {
                setShowEntradaForm(false);
                fetchMovements();
                setSelectedMovement(movement);
                setTicketType("entrada");
                setShowTicketModal(true);
              }}
            />
          </div>
        </div>
      )}

      {/* Modal Salida */}
      {showSalidaForm && selectedMovement && (
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
          onClick={() => setShowSalidaForm(false)}
        >
          <div onClick={(e) => e.stopPropagation()}>
            <RegistrarSalidaForm
              movement={selectedMovement}
              onClose={() => {
                setShowSalidaForm(false);
                setSelectedMovement(null);
                fetchMovements();
              }}
              onSuccess={(movement) => {
                setShowSalidaForm(false);
                setSelectedMovement(movement);
                setTicketType("salida");
                setShowTicketModal(true);
                fetchMovements();
              }}
            />
          </div>
        </div>
      )}

      <h2>Movimientos Activos</h2>
      <input
          type="text"
          placeholder="Buscar movimiento..."
          style={{ marginLeft: "10px" }}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

      {loading && <p>Cargando movimientos...</p>}
      {error && <p>Error: {error}</p>}

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
              <th>Tipo Vehiculo</th>
              <th>Ticket</th>
              <th>Fecha Entrada</th>
              <th>Notas</th>
              <th>Usuario</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {data
  .filter((mov) =>
    mov.vehicle?.plateVehicle.toLowerCase().includes(searchTerm.toLowerCase()) ||
    mov.ticketNumber.toLowerCase().includes(searchTerm.toLowerCase())
  )
  .map((mov) => (
    <tr key={mov.idMovement}>
      <td>{mov.idMovement}</td>
      <td>{mov.vehicle?.plateVehicle}</td>
      <td>{mov.vehicle.typeVehicle}</td>
      <td>{mov.ticketNumber}</td>
      <td>{new Date(mov.entryTime).toLocaleString()}</td>
      <td>{mov.notes}</td>
      <td>{mov.entryUser?.nameUser}</td>
      <td>
  <button onClick={() => { setSelectedMovement(mov); setShowSalidaForm(true); }} style={{ marginLeft: "10px" }}>
    Dar salida
  </button>
  <button onClick={() => handleCancel(mov.idMovement)} style={{ marginLeft: "10px" }}>
    Cancelar
  </button>
  <button onClick={() => {
    setSelectedMovement(mov);
    setShowTicketModal(true);
  }} style={{ marginLeft: "10px" }}>
    Imprimir Ticket
  </button>
</td>
    </tr>
    
  ))}
          </tbody>
        </table>
      )}
      {showTicketModal && selectedMovement && (
  <div
    style={{
      position: "fixed",
      inset: 0,
      background: "rgba(116, 123, 119, 0.43)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1000
    }}
    onClick={() => {
      setShowTicketModal(false);
      setSelectedMovement(null);
    }}
  >
    <div onClick={(e) => e.stopPropagation()}>
      {ticketType === "entrada" ? (
        <TicketEntrada movement={selectedMovement} autoPrint />
      ) : (
        <TicketSalida movement={selectedMovement} autoPrint />
      )}
    </div>
  </div>
)}

    </div>
  );

  
}



export default PrincipalPage;
