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
      user.createdAt = new ObjectId(user._id).getTimestamp()
      delete user.password
      return user
    })

    return filteredUsers
  } catch (error) {
    throw error
  }
}

//TODO: fix new ObjectId(userId)
async function getById(userId) {
  try {
    const collection = await dbService.getCollection(collectionName)
    const user = await collection.findOne({ _id: new ObjectId(userId) })
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
    await collection.deleteOne({ _id: new ObjectId(userId) })
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

//TODO: if the user don't want to change his full name? so i get null
async function update(user) {
  console.log("user", user)
  const userToSave = {
    _id: new ObjectId(user._id),
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
