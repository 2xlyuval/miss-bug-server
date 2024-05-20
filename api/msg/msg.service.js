import { dbService } from "../../services/db.service.js"
import mongodb from "mongodb"
const { ObjectId } = mongodb

const collectionName = "msg"

export const msgService = {
  add,
  remove,
}

async function remove(msgId) {
  try {
    const collection = await dbService.getCollection(collectionName)
    const { deletedCount } = await collection.deleteOne({
      _id: ObjectId.createFromHexString(msgId),
    })
    return deletedCount
  } catch (error) {
    throw error
  }
}

async function add(msg) {
  try {
    const msgToAdd = {
      txt: msg.txt,
      aboutBugId: ObjectId.createFromHexString(msg.aboutBugId),
      byUserId: ObjectId.createFromHexString(msg.byUserId),
    }
    const collection = await dbService.getCollection(collectionName)
    const savedMsg = await collection.insertOne(msgToAdd)
    return savedMsg
  } catch (error) {
    throw error
  }
}
