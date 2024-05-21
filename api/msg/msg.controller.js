import { msgService } from "./msg.service.js"

export async function getMsgs(req, res) {
  const filterBy = req.query

  try {
    const msgs = await msgService.query(filterBy)
    res.send(msgs)
  } catch (err) {
    res.status(400).send(`Could'nt get msgs ${err}`)
  }
}

export async function removeMsg(req, res) {
  const { msgId } = req.params

  try {
    const deletedCount = await msgService.remove(msgId)
    if (deletedCount === 1) {
      res.send("msg deleted")
    } else {
      res.status(400).send(`Could'nt remove msg: ${err}`)
    }
  } catch (err) {
    res.status(400).send(`Could'nt remove msg: ${err}`)
  }
}

export async function addMsg(req, res) {
  const { txt, aboutBugId } = req.body
  const loggedinUser = req.loggedinUser

  try {
    const msgToSave = {
      txt,
      aboutBugId,
      byUserId: loggedinUser._id,
    }

    const savedMsg = await msgService.add(msgToSave)
    res.send(savedMsg)
  } catch (err) {
    res.status(400).send(`Could'nt add msg ${err}`)
  }
}
