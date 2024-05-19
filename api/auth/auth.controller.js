import { authService } from "./auth.service.js"

export async function signup(req, res) {
  try {
    const credentials = req.body

    await authService.signup(credentials)

    const user = await authService.login(credentials)
    const loginToken = authService.getLoginToken(user)
    res.cookie("loginToken", loginToken, { sameSite: "None", secure: true })
    res.json(user)
  } catch (err) {
    res.status(400).send({ error: "Fail to signup" + err })
  }
}

export async function login(req, res) {
  const credentials = req.body

  try {
    const user = await authService.login(credentials)
    const loginToken = authService.getLoginToken(user)

    res.cookie("loginToken", loginToken, { sameSite: "None", secure: true })
    res.json(user)
  } catch (err) {
    res.status(400).send({ error: "Fail to login" + err })
  }
}

export async function logout(req, res) {
  try {
    res.clearCookie("loginToken")
    res.send("Logged out")
  } catch (err) {
    res.status(400).send({ error: "Fail to logout" + err })
  }
}
