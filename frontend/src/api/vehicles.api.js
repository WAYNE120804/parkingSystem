import { http } from "./http"
export const getVehicles = () =>
  http.get("/vehicles").then(r => r.data);

export const createVehicle = (data) =>
  http.post("/vehicles/create", data).then(r => r.data);

export const updateVehicle = (idVehicle, data) =>
  http.put(`/vehicles/${idVehicle}`, data).then(r => r.data);

export const getVehicleById = (idVehicle) =>
  http.get(`/vehicles/${idVehicle}`).then(r => r.data);

export const deleteVehicle = (idVehicle) =>
  http.delete(`/vehicles/${idVehicle}`).then(r => r.data);

export const getAllVehicles = () =>
  http.get("/vehicles/all").then(r => r.data);

export const getByTypeVehicle = (typeVehicle) =>
  http.get(`/vehicles/by-type/${typeVehicle}`).then(r => r.data);

export const getVehicleByPlate = (plate) =>
  http.get(`/vehicles/by-plate/${plate}`).then(r => r.data);




