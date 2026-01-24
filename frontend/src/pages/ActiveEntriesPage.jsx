import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";

const BASE_URL = "http://localhost:3001";

export default function ActiveEntriesPage() {
  const [movements, setMovements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        setError("");

        // ✅ Endpoint real de tu backend
        const res = await axios.get(`${BASE_URL}/movements/activeMovements`);

        // res.data es un array de movimientos con { vehicle: {...}, entryUser: {...} }
        setMovements(res.data);
      } catch (e) {
        setError("No pude cargar las entradas activas. Revisa backend, CORS y la ruta.");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  // ✅ Filtrar por placa, que viene dentro de vehicle
  const filtered = useMemo(() => {
    const s = search.trim().toLowerCase();
    if (!s) return movements;

    return movements.filter((m) =>
      (m.vehicle?.plateVehicle || "").toLowerCase().includes(s)
    );
  }, [movements, search]);

  const formatDate = (value) => {
    if (!value) return "NO REGISTRA";
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return String(value);
    return d.toLocaleString();
  };

  return (
    <div style={{ padding: 16, maxWidth: 1000, margin: "0 auto" }}>
      <h2 style={{ textAlign: "center", marginBottom: 12 }}>entradas activas</h2>

      <input
        style={{ width: "100%", padding: 12, marginBottom: 12 }}
        placeholder="buscar entrada por placa"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {loading && <p>Cargando...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {!loading && !error && (
        <table
          width="100%"
          border="1"
          cellPadding="8"
          style={{ borderCollapse: "collapse" }}
        >
          <thead>
            <tr>
              <th>placa</th>
              <th>vehiculo</th>
              <th>entrada</th>
              <th>usuario</th>
              <th>acciones</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((m) => (
              <tr key={m.id}>
                {/* ✅ placa viene de m.vehicle.plate */}
                <td>{m.vehicle?.plateVehicle ?? "N/A"}</td>

                {/* ⚠️ ajusta este campo al nombre real en tu modelo */}
                <td>{m.vehicle?.typeVehicle ?? "N/A"}</td>

                {/* ✅ entryTime viene del movement */}
                <td>{formatDate(m.entryTime)}</td>

                {/* ✅ entryUser incluido por Prisma */}
                <td>{m.entryUser?.name ?? m.entryUser?.username ?? "N/A"}</td>

                <td>
                  {/* Luego lo conectamos al modal de salida */}
                  <button onClick={() => console.log("Registrar salida:", m.id)}>
                    registrar salida
                  </button>{" "}
                  <button onClick={() => console.log("Cancelar entrada:", m.id)}>
                    cancelar entrada
                  </button>
                </td>
              </tr>
            ))}

            {filtered.length === 0 && (
              <tr>
                <td colSpan="5" style={{ textAlign: "center" }}>
                  Sin resultados
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}
