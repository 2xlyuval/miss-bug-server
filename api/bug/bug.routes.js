import express from "express"
import {
  getBugs,
  getBug,
  removeBug,
  updateBug,
  addBug,
} from "./bug.controller.js"
import { requireAuth } from "../../middlewares/requireAuth.middleware.js"

const router = express.Router()

router.get("/", getBugs)
router.get("/:bugId", getBug)
router.delete("/:bugId", requireAuth, removeBug)
router.put("/:bugId", requireAuth, updateBug)
router.post("/", requireAuth, addBug)

export const bugRoutes = router
