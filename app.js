const express = require("express");
const app = express()
const port = 3000
const userRouter = require("./routes/users.routes")
const articleRouter = require("./routes/articles.routes")

app.get('/', (req, res) => {
    res.send("Selamat datang di Personal blog API")
})

app.use("/user", userRouter)
app.use("/article", articleRouter)

app.listen(port, () => {
    console.log(`listening on port ${port}`)
})