const Router = require("express")
const { register, login } = require("../controllers/users.controllers")

const userRouter = Router()

userRouter.post("/register", register)
userRouter.post("/login", login)

module.exports = userRouter;