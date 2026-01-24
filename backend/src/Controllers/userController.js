const userService = require("../Services/userService");
const { z } = require("zod");

const userSchema = z.object({
  nameUser: z.string().min(2),
  roleUser: z.enum(["ADMIN", "CASHIER", "GUARD"])
});

exports.createUser = async (req, res) => {
  const parsed = userSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json(parsed.error);
  }

  try {
    const user = await userService.createUser(parsed.data);
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getUserById = async (req, res) => {
  const id = Number(req.params.idUser);
  if (isNaN(id)) {
    return res.status(400).json({ error: "idUser inválido" });
  }

  try {
    const user = await userService.getUserById(id);
    res.json(user);
  } catch (error) {
    if (error.code === "USER_NOT_FOUND") {
      return res.status(404).json({ error: error.message });
    }
    res.status(500).json({ error: error.message });
  }
};

exports.getAllUsers = async (_req, res) => {
  try {
    const users = await userService.getAllUsers();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateUser = async (req, res) => {
  const id = Number(req.params.idUser);
  if (isNaN(id)) {
    return res.status(400).json({ error: "idUser inválido" });
  }

  const parsed = userSchema.partial().safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json(parsed.error);
  }

  try {
    const user = await userService.updateUser(id, parsed.data);
    res.json(user);
  } catch (error) {
    if (error.code === "USER_NOT_FOUND") {
      return res.status(404).json({ error: error.message });
    }
    res.status(500).json({ error: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  const id = Number(req.params.idUser);
  if (isNaN(id)) {
    return res.status(400).json({ error: "idUser inválido" });
  }

  try {
    await userService.deleteUser(id);
    res.status(204).send();
  } catch (error) {
    if (error.code === "USER_NOT_FOUND") {
      return res.status(404).json({ error: error.message });
    }
    res.status(500).json({ error: error.message });
  }
};

exports.getUsersByRole = async (req, res) => {
  try {
    const users = await userService.getUsersByRole(req.params.roleUser);
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
