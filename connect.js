// const Scale = require('./Scale/scale.js');
let noble = require('noble-mac')
let peripheralId = "e0ff1a5adf4f43ea87fd067f66ce3395" // process.argv[2].toLowerCase()
// let scale

noble.startScanning()

noble.on('discover', (peripheral) => {
  console.log(peripheral.id)
  if(peripheral.id === "e0ff1a5adf4f43ea87fd067f66ce3395") peripheral.connect(() => {
    noble.stopScanning()
    // scale = new Scale(peripheral)

    peripheral.discoverServices(['181d'], (e, services) => {
      let scale = services[0]
      console.log({scale})
      scale.discoverCharacteristics(['2a9d'], (e, characteristics) => {   // Weight Measurement Characteristics
        let weightChar = characteristics[0]
        weightChar.subscribe()

        weightChar.on('data', (data) => {
          let status = data.readIntLE(0,1)
          let weight = data.readUInt16LE(1) / 200
          let isStabilized = status > 2 ? true : false
          let isRemoved = status < 0 ? true : false;
          console.log(weight)
          console.log(isStabilized ? 'isStabilized' : 'notStabilized')
          console.log(isRemoved ? 'isRemoved' : 'notRemoved')
        })

      })
    })

  })
})
