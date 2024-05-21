import { asyncLocalStorage } from "../../services/als.service.js"
import { dbService } from "../../services/db.service.js"
import mongodb from "mongodb"
const { ObjectId } = mongodb

const collectionName = "user"

export const userService = {
  query, // List of users
  getById, // User details
  getByUserName, // Login
  remove, // Delete user
  update, // Edit user
  add, // Signup
}

async function query(filterBy = {}) {
  const criteria = _buildCriteria(filterBy)
  try {
    const collection = await dbService.getCollection(collectionName)
    let filteredUsers = await collection.find(criteria).toArray()

    filteredUsers = filteredUsers.map((user) => {
      user.createdAt = ObjectId.createFromHexString(user._id).getTimestamp()
      delete user.password
      return user
    })

    return filteredUsers
  } catch (error) {
    throw error
  }
}

async function getById(userId) {
  try {
    const collection = await dbService.getCollection(collectionName)
    const user = await collection.findOne({
      _id: ObjectId.createFromHexString(userId),
    })
    return user
  } catch (error) {
    throw error
  }
}

async function getByUserName(userName) {
  try {
    const collection = await dbService.getCollection(collectionName)
    const user = collection.findOne({ userName })
    return user
  } catch (error) {
    throw error
  }
}

async function remove(userId) {
  try {
    const collection = await dbService.getCollection(collectionName)
    await collection.deleteOne({ _id: ObjectId.createFromHexString(userId) })
  } catch (error) {
    throw error
  }
}

async function add(user) {
  const userToAdd = {
    userName: user.userName,
    fullName: user.fullName,
    password: user.password,
    score: 0,
    isAdmin: false,
  }
  try {
    const collection = await dbService.getCollection(collectionName)
    await collection.insertOne(userToAdd)
    return userToAdd
  } catch (error) {
    throw error
  }
}

async function update(user) {
  const { loggedinUser } = asyncLocalStorage.getStore()
  //only admin and the user himself can update his details
  if (!loggedinUser.isAdmin && loggedinUser._id !== user._id) {
    throw new Error("Not authorized")
  }

  const userToSave = {
    _id: ObjectId.createFromHexString(user._id),
    userName: user.userName,
    fullName: user.fullName,
    score: +user.score,
  }
  try {
    const collection = await dbService.getCollection(collectionName)
    await collection.updateOne({ _id: userToSave._id }, { $set: userToSave })
    return userToSave
  } catch (error) {
    throw error
  }
}

function _buildCriteria(filterBy) {
  const criteria = {}
  if (filterBy.txt) {
    const txtCriteria = { $regex: filterBy.txt, $options: "i" }
    criteria.$or = [
      {
        userName: txtCriteria,
      },
      {
        fullName: txtCriteria,
      },
    ]
  }
  if (filterBy.score) {
    criteria.score = { $gte: filterBy.score }
  }
  return criteria
}
