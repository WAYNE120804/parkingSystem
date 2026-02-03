🚗 Parking System

Sistema de gestión de parqueaderos – Full Stack

Parking System es una aplicación full stack diseñada para la gestión completa de parqueaderos, permitiendo registrar entradas y salidas de vehículos, calcular cobros automáticos por tiempo, generar tickets imprimibles y administrar usuarios, tarifas e información del parqueadero de forma centralizada.

El sistema está orientado a entornos reales (parqueaderos pequeños y medianos) y prioriza simplicidad operativa, control administrativo y trazabilidad de los movimientos.

✨ Funcionalidades principales
🚘 Gestión de vehículos

Registro automático de vehículos por placa

Soporte para carros y motos

Normalización de placas (evita duplicados por espacios o mayúsculas)

⏱️ Control de entradas y salidas

Registro de entrada con generación automática de ticket

Registro de salida con cálculo automático del valor a pagar

Validación para evitar múltiples entradas activas del mismo vehículo

Cancelación de movimientos (solo ADMIN)

💰 Cálculo automático de cobros

Tarifas configurables por tipo de vehículo

Cálculo por horas (redondeo automático)

Vista previa del valor antes de confirmar el pago

Registro del método de pago:

Efectivo

Tarjeta

Transferencia

Nequi

Daviplata

🧾 Tickets e impresión

Ticket de entrada

Recibo de salida

Tickets imprimibles optimizados para impresoras térmicas

Incluyen:

Logo del parqueadero

Información legal

Placa, fechas, horas y total pagado

👥 Gestión de usuarios

Roles:

ADMIN (configuración total)

CASHIER (cobros y salidas)

GUARD (registro de entradas)

Control de usuarios activos/inactivos

Autenticación local (modo demo)

⚙️ Configuración del parqueadero

Nombre del parqueadero

NIT

Dirección

Responsable

Mensaje personalizado en tickets

Carga y actualización del logo

📊 Reportes e historial

Historial completo de movimientos

Filtros por:

Fecha de entrada

Fecha de salida

Estado (activo / finalizado)

Informe de pagos con total recaudado

Exportable mediante impresión

🧱 Arquitectura del sistema
Backend

Node.js + Express

Prisma ORM

Base de datos SQLite

Arquitectura por capas:

Controllers

Services

Routes

Validaciones con Zod

Transacciones seguras para pagos

Frontend

React + Vite

Context API para:

Autenticación

Configuración global

Axios para comunicación con la API

React Router para navegación

React-to-print para impresión de tickets e informes

📂 Estructura del proyecto
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

▶️ Cómo ejecutar el proyecto
1️⃣ Backend
cd backend
npm install
npx prisma migrate dev
npx prisma db seed
npm run dev


Servidor corre en:

http://localhost:3001

2️⃣ Frontend
cd frontend
npm install
npm run dev


Aplicación corre en:

http://localhost:5173

🔐 Usuario por defecto
Usuario: admin
Contraseña: admin123456
Rol: ADMIN


⚠️ Este usuario es solo para pruebas y demostración.

🎯 Casos de uso reales

Parqueaderos urbanos

Centros comerciales pequeños

Instituciones educativas

Edificios residenciales

Pruebas académicas y proyectos universitarios

🚀 Posibles mejoras futuras

Autenticación real con JWT

Persistencia de usuarios en backend

Reportes exportables a PDF/Excel

Control de cupos disponibles

Dashboard con métricas

Integración con lectores de placas (OCR)

👨‍💻 Autor

Jhon Sebastián Díaz Villa
Ingeniería de Sistemas y Telecomunicaciones
Proyecto académico – Sistema de Parqueaderos
