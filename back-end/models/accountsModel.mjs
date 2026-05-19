import { db } from '../db.mjs'
import { ObjectId } from 'mongodb'

export class AccountsModel {
  static async getAll () {
    const allAccounts = await db.collection('accounts').find().toArray()
    return allAccounts
  }

  static async getAccountID (id) {
    const accountId = new ObjectId(id['_id.$oid'])

    const account = await db.collection('accounts').findOne({
      _id: accountId
    })

    if (!account) throw new Error(`La cuenta con ID ${id['_id.$oid']} no existe`)

    return {
      _id: account._id,
      name: account.name,
      amount: account.amount.toString(),
      color: account.color
    }
  }

  static async getAccountUser (id) {
    const userId = new ObjectId(id['_id.$oid'])

    const accounts = await db.collection('accounts').find({
      idUsers: userId
    }).toArray()

    accounts.forEach(account => {
      account.amount = account.amount.toString()
    })

    return accounts
  }

  static async postAccount ({ account }) {
    const newAccount = {
      name: account.name,
      amount: account.amount,
      color: account.color.toLowerCase(),
      idUsers: account.idUsers.map(user => new ObjectId(user))
    }

    const result = await db.collection('accounts').insertOne(newAccount)
    if (!result) throw new Error('Ha ocurrido un error creando la cuenta')

    const createdAccount = await this.getAccountID({ '_id.$oid': result.insertedId })
    if (!createdAccount) throw new Error('Ha ocurrido un error creando la cuenta')

    return {
      success: true,
      _id: createdAccount._id
    }
  }
}
