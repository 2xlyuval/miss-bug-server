import express from "express"
import { getMsgs, removeMsg, addMsg } from "./msg.controller.js"
import {
  requireAuth,
  requireAdmin,
} from "../../middlewares/requireAuth.middleware.js"

const router = express.Router()

// router.get("/", getMsgs)
router.delete("/:msgId", requireAdmin, removeMsg)
router.post("/", requireAuth, addMsg)

export const msgRoutes = router
