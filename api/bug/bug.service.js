import fs from "fs"
import { utilService } from "../../services/util.service.js"

const bugs = utilService.readJsonFile("./data/bug.json")
const PAGE_SIZE = 2
export const bugService = {
  query,
  getById,
  remove,
  save,
}

async function query(filterBy = {}) {
  let filteredBugs = [...bugs]
  try {
    if (filterBy.txt) {
      const regExp = new RegExp(filterBy.txt, "i")
      filteredBugs = filteredBugs.filter(
        (bug) => regExp.test(bug.title) || regExp.test(bug.description)
      )
    }

    if (filterBy.severity) {
      filterBy.severity = +filterBy.severity

      filteredBugs = filteredBugs.filter(
        (bug) => bug.severity >= filterBy.severity
      )
    }

    if (filterBy.labels) {
      filteredBugs = filteredBugs.filter((bug) =>
        bug.labels.some((label) => label === filterBy.labels)
      )
    }

    //sort by title / severity / createdAt
    if (filterBy.sortBy) {
      // if there is filterBy.ascending, convert it to boolean
      if (filterBy.ascending === "true") filterBy.ascending = true
      else if (filterBy.ascending === "false") filterBy.ascending = false

      _sortBugs(filteredBugs, filterBy.sortBy, filterBy.ascending)
    }

    if (filterBy.pageIdx !== undefined) {
      const startIdx = filterBy.pageIdx * PAGE_SIZE
      filteredBugs = filteredBugs.slice(startIdx, startIdx + PAGE_SIZE)
    }

    return filteredBugs
  } catch (error) {
    throw error
  }
}

async function getById(bugId) {
  try {
    const bug = bugs.find((bug) => bug._id === bugId)
    return bug
  } catch (error) {
    throw error
  }
}

async function remove(bugId) {
  try {
    const bugIdx = bugs.findIndex((bug) => bug._id === bugId)
    bugs.splice(bugIdx, 1)
    _saveBugsToFile()
  } catch (error) {
    throw error
  }
}

async function save(bugToSave) {
  try {
    if (bugToSave._id) {
      const idx = bugs.findIndex((bug) => bug._id === bugToSave._id)
      if (idx < 0) throw `Cant find bug with _id ${bugToSave._id}`
      bugs[idx] = { ...bugs[idx], ...bugToSave }
    } else {
      bugToSave._id = utilService.makeId()
      bugToSave.createdAt = Date.now()
      bugs.push(bugToSave)
    }
    await _saveBugsToFile()
    return bugToSave
  } catch (error) {
    throw error
  }
}

function _saveBugsToFile(path = "./data/bug.json") {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(bugs, null, 4)
    fs.writeFile(path, data, (err) => {
      if (err) return reject(err)
      resolve()
    })
  })
}

function _sortBugs(bugs, sortBy, ascending = true) {
  if (sortBy === "title") {
    bugs.sort((a, b) => {
      const bugTitleA = a.title.toUpperCase()
      const bugTitleB = b.title.toUpperCase()

      if (bugTitleA < bugTitleB) {
        return ascending ? -1 : 1
      }
      if (bugTitleA > bugTitleB) {
        return ascending ? 1 : -1
      }
      return 0
    })
  } else if (sortBy === "severity") {
    bugs.sort((a, b) =>
      ascending ? a.severity - b.severity : b.severity - a.severity
    )
  } else if (sortBy === "createdAt") {
    bugs.sort((a, b) =>
      ascending ? a.createdAt - b.createdAt : b.createdAt - a.createdAt
    )
  } else {
    console.error('Invalid sorting type. Please use "title" or "severity".')
  }
}
