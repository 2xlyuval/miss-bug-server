import { dbService } from "../../services/db.service.js"
import mongodb from "mongodb"
const { ObjectId } = mongodb

const collectionName = "bug"
const PAGE_SIZE = 2

export const bugService = {
  query,
  getById,
  remove,
  save,
}

async function query(filterBy = {}) {
  const criteria = _buildCriteria(filterBy)
  try {
    const collection = await dbService.getCollection(collectionName)
    const bugCursor = await collection.find(criteria)

    if (filterBy.sortBy) {
      bugCursor.sort({ [filterBy.sortBy]: 1 })
    }

    if (filterBy.pageIdx !== undefined) {
      const startIdx = filterBy.pageIdx * PAGE_SIZE
      bugCursor.skip(startIdx).limit(PAGE_SIZE)
    }

    const bugs = await bugCursor.toArray()
    return bugs
  } catch (error) {
    throw error
  }
}

async function getById(bugId) {
  try {
    const collection = await dbService.getCollection(collectionName)
    const bug = await collection.findOne({
      _id: ObjectId.createFromHexString(bugId),
    })
    return bug
  } catch (error) {
    throw error
  }
}

async function remove(bugId) {
  try {
    const collection = await dbService.getCollection(collectionName)
    await collection.deleteOne({ _id: ObjectId.createFromHexString(bugId) })
  } catch (error) {
    throw error
  }
}

async function save(bugToSave) {
  try {
    const collection = await dbService.getCollection(collectionName)
    if (bugToSave._id) {
      bugToSave._id = ObjectId.createFromHexString(bugToSave._id)
      await collection.updateOne({ _id: bugToSave._id }, { $set: bugToSave })
    } else {
      await collection.insertOne(bugToSave)
    }
    return bugToSave
  } catch (error) {
    throw error
  }
}

function _buildCriteria(filterBy) {
  const criteria = {}
  if (filterBy.txt) {
    // or by title or by description
    criteria.$or = [
      { title: { $regex: filterBy.txt, $options: "i" } },
      { description: { $regex: filterBy.txt, $options: "i" } },
    ]
  }
  if (filterBy.severity) {
    criteria.severity = { $gte: +filterBy.severity }
  }
  if (filterBy.labels) {
    criteria.labels = { $in: [filterBy.labels] }
  }
  if (filterBy.createdBy) {
    criteria["creator._id"] = filterBy.createdBy
  }
  return criteria
}
