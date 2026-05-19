import { AccountsModel } from '../models/accountsModel.mjs'
import { validateAccount } from '../schemas/accountsSchema.mjs'

export class AccountsController {
  static async get (req, res) {
    if (req.query.user) {
      AccountsController.getAccountsByUser(req, res)
    } else {
      AccountsController.getAllAccounts(req, res)
    }
  }

  static async getAllAccounts (req, res) {
    try {
      const accounts = await AccountsModel.getAll()

      if (!accounts) throw new Error('Ha ocurrido un error')
      res.send(accounts)
    } catch (error) {
      res.status(400).send({ error: error.message })
    }
  }

  static async getAccount (req, res) {
    const { id } = req.params

    try {
      const account = await AccountsModel.getAccountID({ '_id.$oid': id })

      if (!account) throw new Error('No se ha encontrado la cuenta')
      res.send({ _id: account._id, name: account.name, amount: account.amount, color: account.color })
    } catch (error) {
      res.status(400).send({ error: error.message })
    }
  }

  static async getAccountsByUser (req, res) {
    const { tokenUser } = req.session
    if (!tokenUser) {
      res.status(401).send({ error: 'No se ha encontrado el token' })
      return
    }

    const { user } = req.query

    try {
      if (tokenUser._id !== user) {
        throw new Error('Usuario no valido')
      }

      const accounts = await AccountsModel.getAccountUser({ '_id.$oid': user })
      res.send(accounts)
    } catch (error) {
      res.status(400).send({ error: error.message })
    }
  }

  static async createAccount (req, res) {
    const { tokenUser } = req.session
    if (!tokenUser) {
      res.status(401).send({ error: 'No se ha encontrado el token' })
      return
    }

    const result = validateAccount(req.body)

    if (!result.success) {
      res.status(400).send({ error: result.error.message })
      return
    }

    if (!result.data.idUsers.includes(tokenUser._id)) {
      res.status(400).send({ error: 'La cuenta ha de ser del usuario' })
      return
    }

    try {
      const createdAccount = await AccountsModel.postAccount({ account: result.data })

      if (!createdAccount) throw new Error('Ha ocurrido un error al crear la cuenta')
      res.status(201).send({ success: true, _id: createdAccount._id })
    } catch (error) {
      res.status(400).send({ error: error.message })
    }
  }
}
