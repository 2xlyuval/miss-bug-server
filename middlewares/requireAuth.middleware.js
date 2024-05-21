import { authService } from "../api/auth/auth.service.js"
import { config } from "../config/index.js"
import { asyncLocalStorage } from "../services/als.service.js"

export function requireAuth(req, res, next) {
  //get the loggedin user from the asyncLocalStorage
  const { loggedinUser } = asyncLocalStorage.getStore()
  req.loggedinUser = loggedinUser

  if (config.isGuestMode && !loggedinUser) {
    req.loggedinUser = { _id: "", fullname: "Guest" }
    return next()
  }
  if (!loggedinUser) return res.status(401).send("Not Authenticated")
  next()
}

export function requireAdmin(req, res, next) {
  // get the loggedin user from cookie loginToken
  const loggedinUser = authService.validateLoginToken(req.cookies.loginToken)
  if (!loggedinUser) return res.status(401).send("Not authenticated")
  if (!loggedinUser?.isAdmin) return res.status(403).send("Not authorized")
  req.loggedinUser = loggedinUser
  next()
}
