import { authService } from "../api/auth/auth.service.js"

export function requireAuth(req, res, next) {
  const loggedinUser = authService.validateLoginToken(req.cookies.loginToken)
  if (!loggedinUser) return res.status(401).send("Not authenticated")

  req.loggedinUser = loggedinUser
  next()
}

export function requireAdmin(req, res, next) {
  const loggedinUser = authService.validateLoginToken(req.cookies.loginToken)
  if (!loggedinUser) return res.status(401).send("Not authenticated")
  if (!loggedinUser?.isAdmin) return res.status(403).send("Not authorized")
  req.loggedinUser = loggedinUser
  next()
}
