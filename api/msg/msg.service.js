import { dbService } from "../../services/db.service.js"
import mongodb from "mongodb"
const { ObjectId } = mongodb

const collectionName = "msg"

export const msgService = {
  query,
  add,
  remove,
}

async function query(filterBy = {}) {
  const criteria = _buildCriteria(filterBy)
  try {
    const collection = await dbService.getCollection(collectionName)
    const msgCursor = await collection.aggregate([
      {
        $match: criteria,
      },
      {
        $lookup: {
          from: "user",
          localField: "byUserId",
          foreignField: "_id",
          as: "byUser",
        },
      },
      {
        $unwind: "$byUser",
      },
      {
        $lookup: {
          from: "bug",
          localField: "aboutBugId",
          foreignField: "_id",
          as: "aboutBug",
        },
      },
      {
        $unwind: "$aboutBug",
      },
      {
        $project: {
          txt: 1,
          byUser: { userName: 1 },
          aboutBug: { title: 1, description: 1 },
        },
      },
    ])
    return msgCursor.toArray()
  } catch (error) {
    throw error
  }
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

function _buildCriteria(filterBy) {
  const criteria = {}
  if (filterBy.aboutBugId) {
    criteria.aboutBugId = ObjectId.createFromHexString(filterBy.aboutBugId)
  }
  if (filterBy.byUserId) {
    criteria.byUserId = ObjectId.createFromHexString(filterBy.byUserId)
  }
  if (filterBy.txt) {
    criteria.txt = { $regex: filterBy.txt, $options: "i" }
  }
  return criteria
}
