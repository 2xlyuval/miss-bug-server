import { authService } from "../api/auth/auth.service.js"

export function requireAuth(req, res, next) {
  const loggedinUser = authService.validateLoginToken(req.cookies.loginToken)
  if (!loggedinUser) return res.status(401).send("Not authenticated")
  next()
}
