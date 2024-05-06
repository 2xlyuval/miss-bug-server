import fs from "fs"
import { utilService } from "../../services/util.service.js"

const users = utilService.readJsonFile("./data/user.json")
const PAGE_SIZE = 2
export const userService = {
  query,
  getById,
  remove,
  save,
}

async function query(filterBy = {}) {
  let filteredUsers = [...users]
  try {
    if (filterBy.txt) {
      const regExp = new RegExp(filterBy.txt, "i")
      filteredUsers = filteredUsers.filter(
        (user) => regExp.test(user.fullName) || regExp.test(user.userName)
      )
    }

    if (filterBy.score) {
      filterBy.score = +filterBy.score

      filteredUsers = filteredUsers.filter(
        (user) => user.score >= filterBy.score
      )
    }

    //sort by name / score
    if (filterBy.sortBy) {
      // if there is filterBy.ascending, convert it to boolean
      if (filterBy.ascending === "true") filterBy.ascending = true
      else if (filterBy.ascending === "false") filterBy.ascending = false

      _sortUsers(filteredUsers, filterBy.sortBy, filterBy.ascending)
    }

    if (filterBy.pageIdx !== undefined) {
      const startIdx = filterBy.pageIdx * PAGE_SIZE
      filteredUsers = filteredUsers.slice(startIdx, startIdx + PAGE_SIZE)
    }

    return filteredUsers
  } catch (error) {
    throw error
  }
}

async function getById(userId) {
  try {
    const user = users.find((user) => user._id === userId)
    return user
  } catch (error) {
    throw error
  }
}

async function remove(userId) {
  try {
    const userIdx = users.findIndex((user) => user._id === userId)
    users.splice(userIdx, 1)
    _saveUsersToFile()
  } catch (error) {
    throw error
  }
}

async function save(userToSave) {
  try {
    if (userToSave._id) {
      const idx = users.findIndex((user) => user._id === userToSave._id)
      if (idx < 0) throw `Cant find user with _id ${userToSave._id}`
      users[idx] = { ...users[idx], ...userToSave }
    } else {
      userToSave._id = utilService.makeId()
      userToSave.createdAt = Date.now()
      users.push(userToSave)
    }
    await _saveUsersToFile()
    return userToSave
  } catch (error) {
    throw error
  }
}

function _saveUsersToFile(path = "./data/user.json") {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(users, null, 4)
    fs.writeFile(path, data, (err) => {
      if (err) return reject(err)
      resolve()
    })
  })
}

function _sortUsers(users, sortBy, ascending = true) {
  if (sortBy === "fullName") {
    users.sort((a, b) => {
      const userTitleA = a.fullName.toUpperCase()
      const userTitleB = b.fullName.toUpperCase()

      if (userTitleA < userTitleB) {
        return ascending ? -1 : 1
      }
      if (userTitleA > userTitleB) {
        return ascending ? 1 : -1
      }
      return 0
    })
  } else if (sortBy === "score") {
    users.sort((a, b) => (ascending ? a.score - b.score : b.score - a.score))
  } else {
    console.error('Invalid sorting type. Please use "fullName" or "score".')
  }
}
