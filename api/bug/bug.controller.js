import { bugService } from "./bug.service.js"

//TODO: add authorization

export async function getBugs(req, res) {
  const filterBy = req.query

  try {
    const bugs = await bugService.query(filterBy)
    res.send(bugs)
  } catch (err) {
    res.status(400).send(`Could'nt get bugs ${err}`)
  }
}

export async function removeBug(req, res) {
  const { bugId } = req.params

  try {
    await bugService.remove(bugId)
    res.send("bug deleted")
  } catch (err) {
    res.status(400).send(`Could'nt remove bug: ${err}`)
  }
}

export async function updateBug(req, res) {
  const { title, severity, description } = req.body
  const bugId = req.params.bugId

  try {
    const bugToSave = {
      _id: bugId,
      title,
      severity: +severity,
      description,
    }

    const savedBug = await bugService.save(bugToSave)
    res.send(savedBug)
  } catch (err) {
    res.status(400).send(`Could'nt save bug: ${err}`)
  }
}

export async function addBug(req, res) {
  const { title, severity, description } = req.body
  const loggedinUser = req.loggedinUser

  try {
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
  } catch (err) {
    res.status(400).send(`Could'nt save bug ${err}`)
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
