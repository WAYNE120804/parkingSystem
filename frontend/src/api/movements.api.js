const {http} = require("./http");

const getMovements = () =>
  http.get("/movements").then(r => r.data);

const registerEntry = (data) =>
  http.post("/movements/entry", data).then(r => r.data);

const exitMovement = (idMovement, data) =>
  http.post(`/movements/exit/${idMovement}`, data).then(r => r.data);

const getActiveMovements = () =>
  http.get("/movements/active").then(r => r.data);

const cancelActiveMovement = (idMovement) =>
  http.post(`/movements/cancelMovement/${idMovement}`).then(r => r.data);

const getMovementById = (idMovement) =>
  http.get(`/movements/getById/${idMovement}`).then(r => r.data);

const getMovementByTicket = (ticketNumber) =>
  http.get(`/movements/getByTicket/${ticketNumber}`).then(r => r.data);

