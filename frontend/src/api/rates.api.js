import { http } from "./http"

export const getRates = () =>
  http.get("/rates").then(r => r.data);

export const createRate = (data) =>
  http.post("/rates/create", data).then(r => r.data);

export const getRateById = (idRate) =>
  http.get(`/rates/${idRate}`).then(r => r.data);

export const getAllRates = () =>
  http.get("/rates/getAll").then(r => r.data);

export const updateRate = (idRate, data) =>
  http.put(`/rates/update/${idRate}`, data).then(r => r.data); 

export const deleteRate = (idRate) =>
  http.delete(`/rates/delete/${idRate}`).then(r => r.data);

export const getRatesByVehicleType = (vehicleType) =>
  http.get(`/rates/by-vehicle-type/${vehicleType}`).then(r => r.data);