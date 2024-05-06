import { userService } from "./user.service.js"

export async function getUsers(req, res) {
  const filterBy = req.query

  try {
    const users = await userService.query(filterBy)
    res.send(users)
  } catch (error) {
    res.status(400).send(`Could'nt get users`)
  }
}

export async function removeUser(req, res) {
  try {
    const userId = req.params.userId
    await userService.remove(userId)
    res.send("deleted")
  } catch (error) {
    res.status(400).send(`Could'nt remove user`)
  }
}

export async function saveUser(req, res) {
  const userToSave = req.body
  userToSave.score = +userToSave.score

  try {
    const savedUser = await userService.save(userToSave)
    res.send(savedUser)
  } catch (error) {
    res.status(400).send(`Could'nt save user`)
  }
}

export async function getUser(req, res) {
  try {
    const userId = req.params.userId
    const user = await userService.getById(userId)
    res.send(user)
  } catch (error) {
    res.status(400).send(`Could'nt get user`)
  }
}
