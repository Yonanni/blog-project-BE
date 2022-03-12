import express from "express";
import cors from "cors"
import userRouter from "./routes/user.js";
import articleRouter from "./routes/article.js";
import commentRouter from "./routes/comments.js";

const port = process.env.PORT || 3003
const server = express()

const whitelist= ["http://localhost:3003", "https://yonbloging.app.vercel"]
var corsOptions = {
    origin: function (origin, callback) {
      if (whitelist.indexOf(origin) !== -1) {
        callback(null, true)
      } else {
        callback(new Error('Not allowed by CORS'))
      }
    }
  }

server.use(express.json())
server.use(cors(corsOptions))

server.use("/users", userRouter)
server.use("/articles", articleRouter)
server.use("/comments", commentRouter)


server.listen(port, ()=> {
    console.log("listening on port:", port)
})
