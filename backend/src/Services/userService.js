const prisma = require("../lib/prisma");

/**
 * Crear un usuario
 */
exports.createUser = async ({ nameUser, roleUser }) => {
  return prisma.user.create({
    data: {
      nameUser,
      roleUser
    }
  });
};

/**
 * Buscar usuario por ID
 */
exports.getUserById = async (idUser) => {
  const user = await prisma.user.findUnique({
    where: { idUser }
  });

  if (!user) {
    const error = new Error("Usuario no encontrado");
    error.code = "USER_NOT_FOUND";
    throw error;
  }

  return user;
};

/**
 * Listar todos los usuarios
 */
exports.getAllUsers = async () => {
  return prisma.user.findMany({
    where: { isActive: true },
    orderBy: { createdAt: "desc" }
  });
};

/**
 * Actualizar usuario
 */
exports.updateUser = async (idUser, data) => {
  const user = await prisma.user.update({
    where: { idUser },
    data
  });

  if (!user) {
    const error = new Error("Usuario no encontrado");
    error.code = "USER_NOT_FOUND";
    throw error;
  }

  return user;
};

/**
 * Eliminar usuario
 */
exports.deleteUser = async (idUser) => {
  const user = await prisma.user.update({
    where: { idUser },
    data: { isActive: false }
  });

  return user;
};

/**
 * Listar usuarios por rol
 */
exports.getUsersByRole = async (roleUser) => {
    return prisma.user.findMany({
        where: { roleUser }
    });
};