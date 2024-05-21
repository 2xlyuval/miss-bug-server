import path from "path"
import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express()
const port = process.env.PORT || 3030

// Express App Config
app.use(cookieParser())
app.use(express.json())

if (process.env.NODE_ENV === "production") {
  app.use(express.static("public"))
} else {
  const corsOptions = {
    origin: [
      "http://127.0.0.1:5173",
      "http://127.0.0.1:3000",
      "http://localhost:5173",
      "http://localhost:3000",
    ],
    credentials: true,
  }

  app.use(cors(corsOptions))
}

// Routes
import { bugRoutes } from "./api/bug/bug.routes.js"
import { userRoutes } from "./api/user/user.routes.js"
import { authRoutes } from "./api/auth/auth.routes.js"
import { msgRoutes } from "./api/msg/msg.routes.js"

import { setupAsyncLocalStorage } from "./middlewares/setupAls.middleware.js"
app.all("*", setupAsyncLocalStorage)

app.use("/api/bug", bugRoutes)
app.use("/api/user", userRoutes)
app.use("/api/auth", authRoutes)
app.use("/api/msg", msgRoutes)

// Make every server-side-route to match the index.html
// so when requesting http://localhost:3030/index.html/car/123 it will still respond with
// our SPA (single page app) (the index.html file) and allow vue/react-router to take it from there
app.get("/**", (req, res) => {
  res.sendFile(path.resolve("public/index.html"))
})

app.listen(port, () => console.log(`Server is running on port: ${port}`))
