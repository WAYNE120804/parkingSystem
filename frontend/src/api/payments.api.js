import { http } from "./http"

export const getPayments = () =>
  http.get("/payments").then(r => r.data);

export const createPayment = (MovementId, data) =>
  http.post(`/payments/payMovement/${movementId}`, data).then(r => r.data);

export const getPaymentById = (idPayment) =>
  http.get(`/payments/${idPayment}`).then(r => r.data);

export const getAllPayments = () =>
  http.get("/payments/all").then(r => r.data);

export const updatePayment = (idPayment, data) =>
  http.put(`/payments/${idPayment}`, data).then(r => r.data);

export const deletePayment = (idPayment) =>
  http.delete(`/payments/${idPayment}`).then(r => r.data);

export const previewPayment = (movementId) =>
  http.get(`/payments/previewPayment/${movementId}`).then(r => r.data);

