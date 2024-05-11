import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express()
// Q - i add port to env file || package.json and i try to delete the ||
const port = process.env.PORT || 3030

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
app.use(express.static("public"))
app.use(cookieParser())
app.use(express.json())

// Routes
import { bugRoutes } from "./api/bug/bug.routes.js"
import { userRoutes } from "./api/user/user.routes.js"
import { authRoutes } from "./api/auth/auth.routes.js"

app.use("/api/bug", bugRoutes)
app.use("/api/user", userRoutes)
app.use("/api/auth", authRoutes)

// app.get("/**", (req, res) => {
//   res.sendFile(path.resolve("public/index.html"))
// })

app.listen(port, () => console.log(`Server is running on port: ${port}`))
