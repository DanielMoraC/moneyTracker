import { ObjectId } from 'mongodb'
import { db } from '../db.mjs'
import { compareSync, hashSync } from 'bcrypt'

// TODO: Añadir el schema

export class UserModel {
  static async getAll () {
    const allUsers = await db.collection('users').find().toArray()
    return allUsers
  }

  static async getUserId (id) {
    const userId = new ObjectId(id['_id.$oid'])

    const user = await db.collection('users').findOne({
      _id: userId
    })

    if (!user) throw new Error(`El usuario con ID ${id['_id.$oid']} no existe`)

    return {
      _id: user._id,
      userName: user.userName,
      name: user.name
    }
  }

  static async checkUserName ({ userName }) {
    const user = await db.collection('users').findOne({
      userName
    })

    if (!user) return false

    return true
  }

  static async postUser ({ user }) {
    const userExists = await this.checkUserName({ userName: user.userName })

    if (userExists) throw new Error(`El usuario ${user.userName} ya existe`)

    const salt = Number(process.env.HASH) ?? 10

    const hashedPassword = hashSync(user.password, salt)

    const newUser = {
      userName: user.userName.toLowerCase(),
      password: hashedPassword,
      name: user.name
    }

    const result = await db.collection('users').insertOne(newUser)
    if (!result) throw new Error('Ha ocurrido un error creando el usuario')

    const createdUser = await this.getUserId({ '_id.$oid': result.insertedId })
    if (!createdUser) throw new Error('Ha ocurrido un error creando el usuario')

    return {
      _id: createdUser._id,
      userName: createdUser.userName,
      name: createdUser.name
    }
  }

  static async deleteUser (id) {
    const userId = new ObjectId(id['_id.$oid'])

    await this.getUserId({ '_id.$oid': userId })

    const result = await db.collection('users').deleteOne({
      _id: userId
    })

    if (!result) throw new Error('Ha ocurrido un error eliminando el usuario')

    return {
      success: true
    }
  }

  static async checkUserLogin ({ userName, password }) {
    const user = await db.collection('users').findOne({
      userName
    })

    if (!user) throw new Error('El nombre de usuario no existe')

    const validPass = compareSync(password, user.password)

    if (!validPass) throw new Error('La contraseña es incorrecta')

    return {
      _id: user._id,
      userName: user.userName,
      name: user.name
    }
  }
}
