const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

module.exports = {
  // find all user
  getAllUsers: async (req, res, next) => {
    try {
      let getAllUsers = await prisma.users.findMany();

      if (getAllUsers.length === 0) {
        return res.status(404).json({
          status: false,
          message: 'No users found',
          data: null,
        });
      }

      return res.status(200).json({
        status: true,
        message: 'User successfully found',
        data: getAllUsers,
      });
    } catch (error) {
      next(error);
    }
  },

  getUserById: async (req, res, next) => {
    try {
      let userId = parseInt(req.params.id, 10);

      let getUser = await prisma.users.findUnique({
        where: {
          id: userId,
        },
        include: {
          post: {
            select: {
              id: true,
              title: true,
            },
          },
        },
      });

      if (!getUser) {
        return res.status(404).json({
          status: false,
          message: 'Bad request!',
          error: 'User not found!',
          data: null,
        });
      }

      return res.status(200).json({
        status: true,
        message: 'User successfully found!',
        error: null,
        data: getUser,
      });
    } catch (error) {
      next(error);
    }
  },
};
