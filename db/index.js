const mongoose = require('mongoose')
const { connectionStr } = require('../config/')

module.exports = {
  connect: () => {
    mongoose.connect(connectionStr, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })

    mongoose.connection.on('error', (err) => {
      console.log(err)
    })

    mongoose.connection.on('open', () => {
      console.log('Mongoose连接成功')
    })
  },
}
