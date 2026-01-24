const express = require("express");
const cors = require("cors");


// Rutas
const userRoutes = require("./Routes/userRoute");
const vehicleRoutes = require("./Routes/vehicleRouter");
const movementRoutes = require("./Routes/movementRoute");
const rateRoutes = require("./Routes/rateRoute");
const paymentRoutes = require("./Routes/paymentRoute");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

// Rutas de usuarios
app.use("/users", userRoutes);

// Rutas de vehículos
app.use("/vehicles", vehicleRoutes);

//rutas de movimientos
app.use("/movements", movementRoutes);

// rutas de tarifas
app.use("/rates", rateRoutes);

// rutas de pagos
app.use("/payments", paymentRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`API running on http://localhost:${PORT}`);
});
