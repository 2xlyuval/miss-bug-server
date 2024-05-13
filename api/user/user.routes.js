import express from "express"
import { getUsers, getUser, removeUser, saveUser } from "./user.controller.js"
import { requireAdmin } from "../../middlewares/requireAuth.middleware.js"

const router = express.Router()

router.get("/", getUsers)
router.get("/:userId", getUser)
router.delete("/:userId", requireAdmin, removeUser)
router.put("/:userId", requireAdmin, saveUser)
router.post("/", requireAdmin, saveUser)

export const userRoutes = router
