import { bugService } from "./bug.service.js"

export async function getBugs(req, res) {
  const filterBy = req.query

  try {
    const bugs = await bugService.query(filterBy)
    res.send(bugs)
  } catch (error) {
    res.status(400).send(`Could'nt get bugs`)
  }
}

export async function removeBug(req, res) {
  try {
    const bugId = req.params.bugId
    await bugService.remove(bugId)
    res.send("deleted")
  } catch (error) {
    res.status(400).send(`Could'nt remove bug`)
  }
}

export async function updateBug(req, res) {
  // const { _id, title, severity, description } = req.body
  // const bugToSave = {
  //   _id,
  //   title,
  //   severity: +severity,
  //   description,
  // }
  const bugToSave = req.body
  bugToSave.severity = +bugToSave.severity
  try {
    const savedBug = await bugService.save(bugToSave)
    res.send(savedBug)
  } catch (error) {
    res.status(400).send(`Could'nt save bug`)
  }
}

export async function addBug(req, res) {
  const { title, severity, description } = req.body
  const bugToSave = {
    title,
    severity,
    description,
  }
  try {
    const savedBug = await bugService.save(bugToSave)
    res.send(savedBug)
  } catch (error) {
    res.status(400).send(`Could'nt save bug`)
  }
}

export async function getBug(req, res) {
  try {
    const bugId = req.params.bugId
    const bug = await bugService.getById(bugId)

    let visitedBugIds = req.cookies.visitedBugIds || []
    if (!visitedBugIds.includes(bugId)) {
      visitedBugIds = [...visitedBugIds, bugId]
    }
    res.cookie("visitedBugIds", visitedBugIds, { maxAge: 5 * 1000 })
    if (visitedBugIds.length <= 3) {
      res.send(bug)
    } else {
      res.status(401).send("Wait for a bit")
    }
  } catch (error) {
    res.status(400).send(`Could'nt get bug`)
  }
}
