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
let findParticipant = (scoreboard, name) => scoreboard.find(element => element.name === name)
let writeToScoreboard = (scoreboard) => { fs.writeFile('scoreboard.json', JSON.stringify(scoreboard)) }

let sendScoreboard = res => { res.send(getScoreboard()) }
app.get('/scoreboard', (req, res) => { sendScoreboard(res) })

// Add new participant
let addParticipant = (name) => {
  let scoreboard = getScoreboard()
  if(!findParticipant(scoreboard, name)) {
    scoreboard.push({"name": name, "score": []})
    writeToScoreboard({"scoreboard": scoreboard})
  }
}
app.get('/scoreboard/add/:name', (req, res) => {
  let data = req.params
  addParticipant(data.name)
  sendScoreboard(res)
})

// Remove existing participant
let removeParticipant = (name) => {
  let scoreboard = getScoreboard()
  let participant = findParticipant(scoreboard, name)
  if(participant) {
    scoreboard.splice(scoreboard.indexOf(participant))
    writeToScoreboard({"scoreboard": scoreboard})
  }
}
app.get('/scoreboard/remove/:name', (req, res) => {
  let data = req.params
  removeParticipant(data.name)
  sendScoreboard(res)
})

app.use('/', router)
app.listen(process.env.port || port)
