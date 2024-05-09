import { authService } from "../auth/auth.service.js"
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
    const loggedinUser = authService.validateLoginToken(req.cookies.loginToken)
    if (!loggedinUser)
      return res.status(401).send("Unauthorize - can not remove bug")
    const bugId = req.params.bugId
    await bugService.remove(bugId)
    res.send("deleted")
  } catch (error) {
    res.status(400).send(`Could'nt remove bug`)
  }
}

export async function updateBug(req, res) {
  const { title, severity, description } = req.body
  const bugId = req.params.bugId

  try {
    const loggedinUser = authService.validateLoginToken(req.cookies.loginToken)
    if (!loggedinUser)
      return res.status(401).send("Unauthorize - can not update bug")

    const bugToSave = {
      _id: bugId,
      title,
      severity: +severity,
      description,
      creator: {
        _id: loggedinUser._id,
        fullName: loggedinUser.fullName,
      },
    }

    const savedBug = await bugService.save(bugToSave)
    res.send(savedBug)
  } catch (error) {
    res.status(400).send(`Could'nt save bug`)
  }
}

export async function addBug(req, res) {
  const { title, severity, description } = req.body

  try {
    const loggedinUser = authService.validateLoginToken(req.cookies.loginToken)
    if (!loggedinUser)
      return res.status(401).send("Unauthorize - can not add bug")

    const bugToSave = {
      title,
      severity: +severity,
      description,
      creator: {
        _id: loggedinUser._id,
        fullName: loggedinUser.fullName,
      },
    }

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
