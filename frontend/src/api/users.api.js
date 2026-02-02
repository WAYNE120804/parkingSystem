import { http } from "./http"

export const getUsers = () =>
  http.get("/users").then(r => r.data);

export const createUser = (data) =>
  http.post("/users/create", data).then(r => r.data);

export const getUserById = (idUser) =>
  http.get(`/users/${idUser}`).then(r => r.data);

export const getAllUsers = () =>
  http.get("/users/getAll").then(r => r.data);

export const updateUser = (idUser, data) =>
  http.put(`/users/${idUser}`, data).then(r => r.data);

export const deleteUser = (idUser) =>
  http.delete(`/users/delete/${idUser}`).then(r => r.data);

export const getUsersByRole = (roleUser) =>
  http.get(`/users/by-role/${roleUser}`).then(r => r.data);