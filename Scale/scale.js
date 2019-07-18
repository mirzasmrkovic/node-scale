var noble = require('noble-mac');

class Scale {
  constructor(peripheral) { this.peripheral = peripheral }

  get advertisement() { return this.peripheral.advertisement }
  get manufacturerData() { return this.advertisement.manufacturerData }
  get serviceData() { return this.advertisement.serviceData }
  get data() { return this.serviceData[0].data }
  get weight() { return this.data.readUInt16LE(1) / 200 }

  get isStabilized() { return (this.serviceData & (1<<5)) ? true : false }
  get loadRemoved() { return (this.serviceDat & (1<<7)) ? true : false }
}

module.exports = Scale
