const express = require('express')
const app = express()
const port = 3000

app.use(express.static('public'))

// Load scoreboard
let getScoreboard = () => {
  let data = fs.readFileSync('./scoreboard.json')
  let {scoreboard} = JSON.parse(data)
  return scoreboard
}

const fs = require('fs')
let writeToScoreboard = (scoreboard) => { fs.writeFile('scoreboard.json', JSON.stringify(scoreboard)) }
app.get('/scoreboard', (req, res) => { res.send(getScoreboard()) })

// Get the information of an existing participant
let findParticipant = (scoreboard, name) => scoreboard.find(element => element.name === name)
app.get('/scoreboard/get/:name', (req, res) => {
  let data = req.params
  let participant = findParticipant(getScoreboard(), data.name)
  if(participant) res.send(participant)
  else res.send({"scoreboard": scoreboard})
})

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

// Add new score to a participant
let addScore = (name, weight, date) => {
  let scoreboard = getScoreboard()
  let participant = findParticipant(scoreboard, name)
  if (participant) {
    let newScore = { "score" : weight, "date": date }
    participant.score.push(newScore)
    writeToScoreboard({"scoreboard": scoreboard})
    return newScore
  }
  else return false
}
app.get('/scoreboard/add/:name/:score/:date', (req, res) => {
  let data = req.params
  let newScore = addScore(data.name, data.score, data.date)
  if(newScore) res.send(newScore)
  else res.send({"Reply": "Problems with adding score."})
})

const router = express.Router()
app.use('/', router)
app.listen(process.env.port || port)
