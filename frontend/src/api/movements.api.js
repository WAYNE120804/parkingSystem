import { http } from "./http"

const getMovements = () =>
  http.get("/movements").then(r => r.data);

export const registerEntry = (data) =>
  http.post("/movements/registerEntry", data).then(r => r.data);

export const exitMovement = (idMovement, data) =>
  http.post(`/movements/exitMovement/${idMovement}`, data).then(r => r.data);

export const getActiveMovements = () =>
  http.get("/movements/activeMovements").then(r => r.data);

export const cancelActiveMovement = (idMovement) =>
  http.post(`/movements/cancelMovement/${idMovement}`).then(r => r.data);

export const getMovementById = (idMovement) =>
  http.get(`/movements/getById/${idMovement}`).then(r => r.data);

export const getMovementByTicket = (ticketNumber) =>
  http.get(`/movements/getByTicket/${ticketNumber}`).then(r => r.data);

export const getActiveMovementsByPlate = (plate) =>
  http.get(`/movements/activeMovements/plate/${plate}`).then(r => r.data);

export const previewPayment = (movementId) =>
  http.get(`/movements/previewPayment/${movementId}`).then(r => r.data);

