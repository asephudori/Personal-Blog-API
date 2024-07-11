const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcrypt');

module.exports = {
  // register
  register: async (req, res, next) => {
    try {
      let { name, email, password } = req.body;

      let userExist = await prisma.users.findUnique({ where: { email } });

      // validate user
      if (userExist) {
        return res.status(400).json({
          status: false,
          message: 'Bad request',
          error: 'Account has been registered.',
          data: null,
        });
      }

      // validate password
      if (password.lenght < 8 || password.lenght > 15) {
        return res.status(400).json({
          status: false,
          message: 'Bad request',
          error:
            'Password should have minimum 8 character or maximum 15 character.',
        });
      }

      // validate email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          status: false,
          message: 'Bad request',
          error: 'The email format is wrong.',
        });
      }

      let encryptedPassword = await bcrypt.hash(password, 10);
      let user = await prisma.users.create({
        data: {
          name,
          email,
          password: encryptedPassword,
        },
      });

      res.status(201).json({
        status: true,
        message: "Register successfully",
        data: {
          user: {
            name: user.name,
            email: user.email
          }
        }
      })
    } catch (error) {
      next(error);
    }
  },
};
