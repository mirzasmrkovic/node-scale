const fs = require('fs')
const express = require('express')
const app = express()
const path = require('path')
const router = express.Router()
const port = 3000

// app.use(express.static(__dirname + '/view'))
router.get('/', (req,res) => { res.sendFile(__dirname + '/view' + '/index.html') })

// Load scoreboard
let getScoreboard = () => {
  let data = fs.readFileSync('./scoreboard.json')
  let {scoreboard} = JSON.parse(data)
  return scoreboard
}

let writeToScoreboard = (scoreboard) => { fs.writeFile('scoreboard.json', JSON.stringify(scoreboard)) }
app.get('/scoreboard', (req, res) => { res.send(getScoreboard()) })

let findParticipant = (scoreboard, name) => scoreboard.find(element => element.name === name)

// Add new participant
let addParticipant = (name) => {
  let scoreboard = getScoreboard()
  if(!findParticipant(scoreboard, name)) {
    let participant = {"name": name, "score": []}
    scoreboard.push(participant)
    writeToScoreboard({"scoreboard": scoreboard})
    return participant
  }
  else return false
}
app.get('/scoreboard/add/:name', (req, res) => {
  let data = req.params
  let participant = addParticipant(data.name)
  if(participant) res.send(participant)
  else res.send({"Reply": "User " + data.name + " already exists."})
})

// Remove existing participant
let removeParticipant = (name) => {
  let scoreboard = getScoreboard()
  let participant = findParticipant(scoreboard, name)
  if(participant) {
    scoreboard.splice(scoreboard.indexOf(participant), 1)
    writeToScoreboard({"scoreboard": scoreboard})
    return participant
  }
  else return false
}
app.get('/scoreboard/remove/:name', (req, res) => {
  let data = req.params
  let participant = removeParticipant(data.name)
  if (participant) res.send(participant)
  else return res.send({"Reply": "User " + data.name + " doesn't exists."})
})

app.use('/', router)
app.listen(process.env.port || port)
