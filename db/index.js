const mongoose = require('mongoose')
const { connectionStr } = require('../config/')

module.exports = {
  connect: () => {
    mongoose.set('useFindAndModify', false)
    
    mongoose.connect(connectionStr, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })

    mongoose.connection.on('error', (err) => {
      console.log('Mongoose连接失败')
      console.log(err)
    })

    mongoose.connection.on('open', () => {
      console.log('Mongoose连接成功')
    })
  },
}
