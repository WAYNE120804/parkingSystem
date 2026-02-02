import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { getAllUsers, deleteUser } from "../api/users.api";
import { getAllRates } from "../api/rates.api"; 
import { getParkingInfo } from "../api/parkingInfo.api";

import UserForm from "../components/userForm";
import RateForm from "../components/RateForm";
import { useUser } from "../context/UserContext.jsx";
import ParkingInfoConfig from "../components/parkingInfoConfig.jsx"; 

function ConfiguracionPage() {
  const [users, setUsers] = useState([]);
  const [rates, setRates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showUserForm, setShowUserForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [showRateForm, setShowRateForm] = useState(false);
  const [editingRate, setEditingRate] = useState(null);

  const [showParkingInfoForm, setShowParkingInfoForm] = useState(false);
  const currentUser = useUser(); 
  const navigate = useNavigate();

  const [parkingInfo, setParkingInfo] = useState(null);

  const fetchData = async () => {
    try {
      const usersData = await getAllUsers();
      const ratesData = await getAllRates();

      setUsers(usersData);
      setRates(ratesData);

      try {
        const parkingData = await getParkingInfo();
        setParkingInfo(parkingData);
      } catch (err) {
        if (err.response?.status === 404) {
          setParkingInfo(null);
        } else {
          setError(err.message);
        }
      }

      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDeleteUser = async (idUser) => {
    try {
      await deleteUser(idUser);
      alert("Usuario eliminado");
      fetchData();
    } catch (err) {
      alert("Error al eliminar usuario: " + err.message);
    }
  };

  if (loading) return <p>Cargando configuración...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>Configuración</h2>

      {/* Botones superiores */}
      <div style={{ marginBottom: "20px" }}>
        {currentUser.roleUser === "ADMIN" && (
          <button
            onClick={() => navigate("/entries")}
            style={{ marginLeft: "10px" }}
          >
            Ir a Entradas
          </button>
        )}
      </div>

      {/* Usuarios */}
      <div style={{ marginBottom: "40px" }}>
        <h3>Usuarios</h3>
        <button onClick={() => { setEditingUser(null); setShowUserForm(true); }}>
          Registrar Usuario
        </button>
        <input
          type="text"
          placeholder="Buscar usuario..."
          style={{ marginLeft: "10px" }}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <table border="1" cellPadding="8" style={{ marginTop: "10px", width: "100%" }}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Rol</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users
              .filter((u) =>
                u.nameUser.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map((u) => (
                <tr key={u.idUser}>
                  <td>{u.idUser}</td>
                  <td>{u.nameUser}</td>
                  <td>{u.roleUser}</td>
                  <td>
                    <button onClick={() => { setEditingUser(u); setShowUserForm(true); }}>
                      Editar
                    </button>
                    <button onClick={() => handleDeleteUser(u.idUser)}>
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* Tarifas */}
      <div style={{ marginBottom: "40px" }}>
        <h3>Tarifas</h3>
        <table border="1" cellPadding="8" style={{ marginTop: "10px", width: "100%" }}>
          <thead>
            <tr>
              <th>Tipo Vehículo</th>
              <th>Precio por Hora (cents)</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {rates.map((r) => (
              <tr key={r.idRate}>
                <td>{r.vehicleType}</td>
                <td>{r.pricePerHourCents}</td>
                <td>
                  <button onClick={() => { setEditingRate(r); setShowRateForm(true); }}>
                    Editar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Información del parqueadero */}
      <div style={{ marginBottom: "40px" }}>
        <h3>Información del Parqueadero</h3>
        {parkingInfo ? (
          <table border="1" cellPadding="8" style={{ marginTop: "10px", width: "100%" }}>
            <tbody>
              <tr><td>ID</td><td>{parkingInfo.id}</td></tr>
              <tr><td>Nombre</td><td>{parkingInfo.parkingName}</td></tr>
              <tr><td>NIT</td><td>{parkingInfo.nit}</td></tr>
              <tr><td>Dirección</td><td>{parkingInfo.address}</td></tr>
              <tr><td>Responsable</td><td>{parkingInfo.responsible}</td></tr>
              <tr><td>Mensaje al pie</td><td>{parkingInfo.footerMessage}</td></tr>
            </tbody>
          </table>
        ) : (
          <p>No hay información registrada aún</p>
        )}
        <button onClick={() => setShowParkingInfoForm(true)}>
          {parkingInfo ? "Editar Información" : "Registrar Información"}
        </button>
      </div>

      {/* Formularios modales */}
      {showUserForm && (
        <UserForm
          mode={editingUser ? "edit" : "create"}
          user={editingUser}
          onClose={() => setShowUserForm(false)}
          onSuccess={fetchData}
        />
      )}

      {showRateForm && (
        <RateForm
          rate={editingRate}
          onClose={() => setShowRateForm(false)}
          onSuccess={fetchData}
        />
      )}

      {showParkingInfoForm && (
        <ParkingInfoConfig
          info={parkingInfo}
          onClose={() => setShowParkingInfoForm(false)}
          onSuccess={fetchData}
        />
      )}
    </div>
  );
}

export default ConfiguracionPage;