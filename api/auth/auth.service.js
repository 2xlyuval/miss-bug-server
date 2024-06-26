import Cryptr from "cryptr"
import bcrypt from "bcrypt"

import { userService } from "../user/user.service.js"

const cryptr = new Cryptr(process.env.CRYPTR_SECRET || "secretKey")

export const authService = {
  signup,
  login,
  getLoginToken,
  validateLoginToken,
}

async function login(credentials) {
  const { userName, password } = credentials

  if (!userName || !password) {
    throw new Error("Missing details")
  }

  const user = await userService.getByUserName(userName)
  if (!user) {
    throw new Error("Invalid username")
  }
  // un comment to validate password
  const match = await bcrypt.compare(password, user.password)
  if (!match) {
    throw new Error("Invalid username or password")
  }

  const minUser = {
    _id: user._id.toString(),
    fullName: user.fullName,
    userName: user.userName,
    score: user.score,
    isAdmin: user.isAdmin,
  }

  return minUser
}

async function signup(credentials) {
  const { userName, password, fullName } = credentials

  if (!userName || !password || !fullName) {
    throw new Error("Missing details")
  }

  const userExists = await userService.getByUserName(userName)
  if (userExists) {
    throw new Error("User already exists")
  }

  const saltRounds = 10
  const hash = await bcrypt.hash(password, saltRounds)
  const user = userService.add({ ...credentials, password: hash })
  return user
}

function getLoginToken(user) {
  const str = JSON.stringify(user)
  const token = cryptr.encrypt(str)
  return token
}

function validateLoginToken(token) {
  try {
    const json = cryptr.decrypt(token)
    const loggedinUser = JSON.parse(json)
    return loggedinUser
  } catch (err) {
    throw new Error("Invalid token")
  }
}
