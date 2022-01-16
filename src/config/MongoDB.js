import mongoose from 'mongoose'
import config from './index'
mongoose.connect(config.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
mongoose.connection.on('open', () => {
  console.log('MongoDB Connect Successfully to "' + config.MONGO_URL + '"')
})
mongoose.connection.on('error', (error) => {
  console.log('MongoDB Connect Error=>' + error)
})
