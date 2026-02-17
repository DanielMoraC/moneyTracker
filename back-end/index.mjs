import express from 'express'
import cors from 'cors'
import { usersRouter } from './routes/usersRoute.mjs'
import { run } from './db.mjs'
import { UserController } from './controllers/usersController.mjs'
import coockieParser from 'cookie-parser'
import { tokenSession } from './middleware/tokenSession.mjs'

const app = express()
const PORT = process.env.PORT ?? 3000

app.use(express.json())
app.use(cors())
app.use(coockieParser())
app.use(tokenSession)
app.disable('x-powered-by')

app.get('/', (req, res) => {
  res.send('Inicio de la aplicación de Money Tracker')
})

app.use('/users', usersRouter)

app.post('/register', UserController.registerUser)

app.use('/login', UserController.loginUser)

app.use('/logout', UserController.logoutUser)

run()
  .then(() => {
    const server = app.listen(PORT, () => {
      const { port } = server.address()
      console.log(`Express server running at http://localhost:${port}`)
    })
  })
  .catch(console.dir)
