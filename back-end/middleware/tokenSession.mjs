import jwt from 'jsonwebtoken'

export const tokenSession = (req, res, next) => {
  const token = req.cookies.access_token
  let data = null

  req.session = { user: null }

  try {
    data = jwt.verify(token, process.env.JWT_SECRET)
    req.session.user = data
  } catch (error) {
    req.session.user = null
  }

  next()
}
