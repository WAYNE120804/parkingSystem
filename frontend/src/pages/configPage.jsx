import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { getAllUsers, deleteUser } from "../api/users.api";
import { getAllRates } from "../api/rates.api"; 
import { getParkingInfo } from "../api/parkingInfo.api";

import UserForm from "../components/userForm";
import RateForm from "../components/RateForm";
import { useAuth, useUser } from "../context/UserContext.jsx";
import ParkingInfoConfig from "../components/parkingInfoConfig.jsx"; 
import { useSettings } from "../context/SettingsContext.jsx";
import { uploadLogo } from "../api/settings.api.js";

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
  const { logout, deleteCredential, changePassword, authUsers, saveCredential } = useAuth();
  const navigate = useNavigate();

  const [parkingInfo, setParkingInfo] = useState(null);
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState("");
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const { logoUrl, updateLogoUrl } = useSettings();

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

  useEffect(() => {
    if (!logoFile) {
      setLogoPreview("");
      return;
    }
    const nextPreview = URL.createObjectURL(logoFile);
    setLogoPreview(nextPreview);
    return () => URL.revokeObjectURL(nextPreview);
  }, [logoFile]);

  const handleDeleteUser = async (idUser) => {
    try {
      await deleteUser(idUser);
      alert("Usuario eliminado");
      deleteCredential(idUser);
      fetchData();
    } catch (err) {
      alert("Error al eliminar usuario: " + err.message);
    }
  };

  const handleChangePassword = (u) => {
    const newPass = prompt(`Nueva contraseña para ${u.nameUser}:`);
    if (!newPass) return;
    changePassword(u.idUser, newPass);
    alert("Contraseña actualizada (solo guardada en el navegador)");
  };

  const handleChangeLogin = (u) => {
    const cred = authUsers.find((c) => c.idUser === u.idUser);
    const newUser = prompt("Nuevo usuario (login):", cred?.username || "");
    if (!newUser) return;
    const newPass = prompt("Nueva contraseña:", cred?.password || "");
    if (!newPass) return;
    saveCredential({
      idUser: u.idUser,
      username: newUser,
      password: newPass,
      nameUser: u.nameUser,
      roleUser: u.roleUser,
      active: true
    });
    alert("Login/contraseña actualizados (guardado local)");
  };

  const handleLogoUpload = async () => {
    if (!logoFile) {
      alert("Selecciona un archivo primero.");
      return;
    }
    try {
      setUploadingLogo(true);
      const data = await uploadLogo(logoFile, currentUser.roleUser);
      updateLogoUrl(data.logoUrl);
      setLogoFile(null);
      alert("Logo actualizado correctamente");
    } catch (error) {
      alert(error.message);
    } finally {
      setUploadingLogo(false);
    }
  };

  if (loading) return <p>Cargando configuración...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>Configuración</h2>

      {/* Botones superiores */}
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
        {currentUser.roleUser === "ADMIN" && (
          <button
            onClick={() => navigate("/entries")}
            style={{ marginLeft: "10px" }}
          >
            Ir a Entradas
          </button>
          
        )}
        <button onClick={() => navigate("/movements")} style={{ marginLeft: "10px" }}>Ver Movimientos</button>
        <button onClick={() => navigate("/payments")} style={{ marginLeft: "10px" }}>Ver Pagos</button>
        <button onClick={() => { logout(); navigate("/login", { replace: true }); }} style={{ marginLeft: "10px" }}>Cerrar sesión</button>

        
      </div>

      {/* Logo del parqueadero */}
      <div style={{ marginBottom: "40px" }}>
        <h3>Logo del Parqueadero</h3>
        <div style={{ display: "flex", gap: "24px", flexWrap: "wrap" }}>
          <div>
            <p>Logo actual:</p>
            {logoUrl ? (
              <img
                src={logoUrl}
                alt="Logo actual"
                style={{ height: "60px", width: "auto", objectFit: "contain" }}
              />
            ) : (
              <p>Sin logo cargado</p>
            )}
          </div>
          <div>
            <p>Nuevo logo:</p>
            {logoPreview ? (
              <img
                src={logoPreview}
                alt="Vista previa del nuevo logo"
                style={{ height: "60px", width: "auto", objectFit: "contain" }}
              />
            ) : (
              <p>Selecciona una imagen para vista previa</p>
            )}
          </div>
        </div>
        <div style={{ marginTop: "12px" }}>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setLogoFile(e.target.files?.[0] || null)}
          />
          <button
            onClick={handleLogoUpload}
            style={{ marginLeft: "10px" }}
            disabled={uploadingLogo}
          >
            {uploadingLogo ? "Subiendo..." : "Guardar Logo"}
          </button>
        </div>
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
              <th>Login</th>
              <th>Contraseña (local)</th>
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
                  <td>{authUsers.find((c) => c.idUser === u.idUser)?.username || "-"}</td>
                  <td>{authUsers.find((c) => c.idUser === u.idUser)?.password || "-"}</td>
                  <td>{u.roleUser}</td>
                  <td>
                    <button onClick={() => { setEditingUser(u); setShowUserForm(true); }} style={{ marginLeft: "10px" }}>
                      Editar
                    </button>
                    <button onClick={() => handleDeleteUser(u.idUser)} style={{ marginLeft: "10px" }}>
                      Eliminar
                    </button>
                    <button onClick={() => handleChangePassword(u) } style={{ marginLeft: "10px" }}>
                      Cambiar contraseña
                    </button>
                    <button onClick={() => handleChangeLogin(u)} style={{ marginLeft: "10px" }}>
                      Cambiar login/contraseña
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
          user={
            editingUser
              ? {
                  ...editingUser,
                  ...authUsers.find((c) => c.idUser === editingUser.idUser)
                }
              : null
          }
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
