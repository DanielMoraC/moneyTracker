import { Router } from 'express'
import { UserController } from '../controllers/usersController.mjs'

export const usersRouter = Router()

usersRouter.get('/', UserController.getAllUsers)

usersRouter.get('/:id', UserController.getUser)

usersRouter.post('/', UserController.createUser)

usersRouter.delete('/:id', UserController.deleteUser)
