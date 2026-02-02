import { http } from "./http";

export const createParkingInfo = (data) =>
  http.post("/parkingInfo/createParkingInfo", data).then((r) => r.data);

export const getParkingInfo = () =>
  http.get("/parkingInfo/getParkingInfo").then((r) => r.data);

export const updateParkingInfo = (id, data) =>
  http.put(`/parkingInfo/updateParkingInfo/${id}`, data).then((r) => r.data);