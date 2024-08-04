const Router = require("express")
const { getAllUsers, getUserById } = require("../controllers/users.controllers")

const userRouter = Router()

userRouter.get("/", getAllUsers)
userRouter.get("/:id", getUserById)

module.exports = userRouter;