import express from "express"
import { getUsers, getUser, removeUser, saveUser } from "./user.controller.js"

const router = express.Router()

// Q - saveUser function
router.get("/", getUsers)
router.get("/:userId", getUser)
router.delete("/:userId", removeUser)
router.put("/:userId", saveUser)
router.post("/", saveUser)

export const userRoutes = router
