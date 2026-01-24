import { http } from "./http"

const getMovements = () =>
  http.get("/movements").then(r => r.data);

const registerEntry = (data) =>
  http.post("/movements/registerEntry", data).then(r => r.data);

const exitMovement = (idMovement, data) =>
  http.post(`/movements/exit/${idMovement}`, data).then(r => r.data);

const getActiveMovements = () =>
  http.get("/movements/activeMovements").then(r => r.data);

const cancelActiveMovement = (idMovement) =>
  http.post(`/movements/cancelMovement/${idMovement}`).then(r => r.data);

const getMovementById = (idMovement) =>
  http.get(`/movements/getById/${idMovement}`).then(r => r.data);

const getMovementByTicket = (ticketNumber) =>
  http.get(`/movements/getByTicket/${ticketNumber}`).then(r => r.data);

const getActiveMovementsByPlate = (plate) =>
  http.get(`/movements/activeMovements/plate/${plate}`).then(r => r.data);

