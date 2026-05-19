import { UserModel } from '../models/usersModel.mjs'
import { validateUser, validatePartialUser } from '../schemas/usersSchema.mjs'
import jwt from 'jsonwebtoken'

export class UserController {
  static async getAllUsers (req, res) {
    try {
      const users = await UserModel.getAll()

      if (!users) throw new Error('Ha ocurrido un error')
      res.send(users)
    } catch (error) {
      res.status(400).send({ error: error.message })
    }
  }

  static async getUser (req, res) {
    const { id } = req.params

    try {
      const user = await UserModel.getUserId({ '_id.$oid': id })

      if (!user) throw new Error('No se ha encontrado el usuario')
      console.log(user)
      res.send({ _id: user._id, userName: user.userName, name: user.name })
    } catch (error) {
      res.status(400).send({ error: error.message })
    }
  }

  static async createUser (req, res) {
    const result = validateUser(req.body)

    if (!result.success) res.status(400).send({ error: result.error.message })

    try {
      const createdUser = await UserModel.postUser({ user: result.data })

      if (!createdUser) throw new Error('Ha ocurrido un error al crear el usuario')
      res.status(201).send({ _id: createdUser._id, userName: createdUser.userName, name: createdUser.name })
    } catch (error) {
      res.status(400).send({ error: error.message })
    }
  }

  static async deleteUser (req, res) {
    const { tokenUser } = req.session
    if (!tokenUser) {
      res.status(401).send({ error: 'No se ha encontrado el token' })
      return
    }

    const { id } = req.params

    try {
      if (tokenUser._id !== id) {
        throw new Error('Usuario no valido')
      }

      const deletedUser = await UserModel.deleteUser({ '_id.$oid': id })

      if (!deletedUser) throw new Error('Ha ocurrido un error al eliminar el usuario')

      res.status(200).send(deletedUser)
    } catch (error) {
      res.status(400).send({ error: error.message })
    }
  }

  static async registerUser (req, res) {
    UserController.createUser(req, res)
  }

  static async loginUser (req, res) {
    const result = validatePartialUser(req.body)

    if (!result.success) res.status(400).send({ error: result.error.message })

    try {
      const user = await UserModel.checkUserLogin({ userName: result.data.userName, password: result.data.password })

      if (!user) throw new Error('El usuario no existe')

      const token = jwt.sign({ _id: user._id, userName: user.userName }, process.env.JWT_SECRET, { expiresIn: '30d' })
      // TODO: No devolver el token - ESTO ESTA MAL Y ES SOLO PARA EL DESARROLLO
      // res.status(200).cookie('access_token', token, { httpOnly: true }).send({ _id: user._id, userName: user.userName, name: user.name })
      res.status(200).cookie('access_token', token, { httpOnly: true }).send({ _id: user._id, userName: user.userName, name: user.name, token })
    } catch (error) {
      res.status(400).send({ error: error.message })
    }
  }

  static async logoutUser (req, res) {
    const { user } = req.session
    if (!user) res.status(401).send({ error: 'No se ha encontrado el token' })

    res.clearCookie('access_token').send({ success: true })
  }
}
