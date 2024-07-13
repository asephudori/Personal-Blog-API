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

      // validate password length
      if (password.length < 8 || password.length > 15) {
        return res.status(400).json({
          status: false,
          message: 'Bad request',
          error:
            'Password should have minimum 8 character or maximum 15 character.',
        });
      }

      // validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          status: false,
          message: 'Bad request',
          error: 'The email format is wrong.',
        });
      }

      // encrypting password
      let encryptedPassword = await bcrypt.hash(password, 10);

      // create users
      let user = await prisma.users.create({
        data: {
          name,
          email,
          password: encryptedPassword,
        },
      });

      // success response
      res.status(201).json({
        status: true,
        message: 'Register successfully',
        data: {
          user: {
            name: user.name,
            email: user.email,
          },
        },
      });
      
    } catch (error) {
      next(error);
    }
  },

  // login
  login: async (req, res, next) => {
    try {
      const { email, password } = req.body
      const user = await prisma.users.findUnique({ where: { email } })
      
      // error message
      if (!user) {
        return res.status(400).json({
          status: false,
          message: "Bad request",
          error: "Invalid Email or Password"
        })
      };

      const correctPassword = await bcrypt.compare(password, user.password)

      if (!correctPassword) {
        return res.status(400).json({
          status: false,
          message: "Bad request",
          error: "Invalid Email or Password"
        })
      };

      // success response
      return res.status(200).json({
        status: true,
        message: "Login Successfully",
        data: {
          name: user.name,
          email: user.email
        }
      });

    } catch (error) {
      next(error)
    }
  }
};
