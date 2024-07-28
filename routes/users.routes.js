const Router = require("express")
const { getAllUsers, getUserById } = require("../controllers/users.controllers")

const userRouter = Router()

userRouter.get("/")
userRouter.get("/:user_id")

module.exports = userRouter;