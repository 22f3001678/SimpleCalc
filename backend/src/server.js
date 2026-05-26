const app = require('./app')
const { PORT } = require('./config/env')

app.listen(PORT, ()=>{
  console.log(`SimpleCalc backend running on port ${PORT}`)
})
