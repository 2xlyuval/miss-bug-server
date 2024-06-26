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
    const msgCursor = await collection.aggregate(_aggregateMsgs(criteria))
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
    await collection.insertOne(msgToAdd)
    const savedMsg = await collection
      .aggregate(_aggregateMsgs({ _id: msgToAdd._id }))
      .next()
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

function _aggregateMsgs(criteria = {}) {
  return [
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
        byUser: { _id: 1, userName: 1 },
        aboutBug: { _id: 1, title: 1, description: 1, severity: 1 },
      },
    },
  ]
}
