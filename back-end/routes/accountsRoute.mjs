import { Router } from 'express'
import { AccountsController } from '../controllers/accountsController.mjs'

export const accountsRouter = Router()

accountsRouter.get('/', AccountsController.get)

accountsRouter.get('/:id', AccountsController.getAccount)

accountsRouter.post('/', AccountsController.createAccount)
