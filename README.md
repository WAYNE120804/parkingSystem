# 🚗 Parking System  
### Sistema de Gestión de Parqueaderos – Full Stack

Parking System es una aplicación **full stack** diseñada para la **gestión completa de parqueaderos**, permitiendo registrar entradas y salidas de vehículos, calcular cobros automáticos por tiempo, generar tickets imprimibles y administrar usuarios, tarifas e información del parqueadero de forma centralizada.

El sistema está pensado para **entornos reales**, priorizando la **simplicidad operativa**, el **control administrativo** y la **trazabilidad de todos los movimientos**.

---

## ✨ Funcionalidades principales

### 🚘 Gestión de vehículos
- Registro automático de vehículos por **placa**
- Soporte para **carros** y **motos**
- Normalización de placas (evita duplicados por espacios o mayúsculas)

### ⏱️ Control de entradas y salidas
- Registro de **entrada** con generación automática de **ticket**
- Registro de **salida** con cálculo automático del valor a pagar
- Validación para evitar múltiples entradas activas por vehículo
- Cancelación de movimientos (solo **ADMIN**)

### 💰 Cálculo automático de cobros
- Tarifas configurables por tipo de vehículo
- Cálculo por horas con redondeo automático
- Vista previa del valor antes de confirmar el pago
- Métodos de pago soportados:
  - 💵 Efectivo
  - 💳 Tarjeta
  - 🔁 Transferencia
  - 📱 Nequi
  - 📲 Daviplata

### 🧾 Tickets e impresión
- Ticket de **entrada**
- Recibo de **salida**
- Optimizado para impresoras térmicas
- Incluye:
  - Logo del parqueadero
  - Información legal
  - Placa del vehículo
  - Fechas y horas
  - Total pagado

### 👥 Gestión de usuarios
- Roles del sistema:
  - **ADMIN** → Control total del sistema
  - **CASHIER** → Cobros y salidas
  - **GUARD** → Registro de entradas
- Control de usuarios activos / inactivos
- Autenticación local (modo demostración)

### ⚙️ Configuración del parqueadero
- Nombre del parqueadero
- NIT
- Dirección
- Responsable
- Mensaje personalizado para tickets
- Carga y actualización del **logo**

### 📊 Reportes e historial
- Historial completo de movimientos
- Filtros por:
  - Fecha de entrada
  - Fecha de salida
  - Estado (activo / finalizado)
- Informe de pagos con total recaudado
- Reportes imprimibles

---

## 🧱 Arquitectura del sistema

### 🔧 Backend
- **Node.js + Express**
- **Prisma ORM**
- **SQLite**
- Arquitectura por capas:
  - Controllers
  - Services
  - Routes
- Validaciones con **Zod**
- Transacciones seguras para pagos

### 🎨 Frontend
- **React + Vite**
- Context API (usuarios y configuración)
- **Axios** para consumo de API
- **React Router**
- **React-to-print** para tickets e informes

---

## 📂 Estructura del proyecto

```bash
parkingsystem/
├── backend/
│   ├── prisma/
│   ├── src/
│   │   ├── Controllers/
│   │   ├── Services/
│   │   ├── Routes/
│   │   └── index.js
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── api/
    │   ├── components/
    │   ├── context/
    │   ├── pages/
    │   └── App.jsx
    └── package.json

```
cd backend
npm install
npx prisma migrate dev
npx prisma db seed
npm run dev

🌐 Backend corre en:
http://localhost:3001

cd frontend
npm install
npm run dev

🌐 Frontend corre en:
http://localhost:5173

🔐 Usuario por defecto
Usuario: admin
Contraseña: admin123456
Rol: ADMIN

🎯 Casos de uso
- Parqueaderos urbanos
- Centros comerciales pequeños
- Instituciones educativas
- Edificios residenciales
- Proyectos académicos
- Demostraciones técnicas


👨‍💻 Autor
Jhon Sebastián Díaz Villa
Ingeniería de Sistemas y Telecomunicaciones
Universidad de Manizales


