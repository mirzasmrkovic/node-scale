const fs = require('fs')
const express = require('express')
const app = express()
const path = require('path')
const router = express.Router()
const port = 3000

router.get('/', (req,res) => { res.sendFile(path.join(__dirname+'/index.html')) })

app.use(express.static(__dirname + '/view'));
app.use(express.static(__dirname + '/script'));

app.use('/', router)
app.listen(process.env.port || port)
