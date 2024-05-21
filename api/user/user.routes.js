import express from "express"
import { getUsers, getUser, removeUser, updateUser } from "./user.controller.js"
import {
  requireAdmin,
  requireAuth,
} from "../../middlewares/requireAuth.middleware.js"

const router = express.Router()

router.get("/", getUsers)
router.get("/:userId", getUser)
router.put("/:userId", requireAuth, updateUser)
router.delete("/:userId", requireAdmin, removeUser)

export const userRoutes = router
