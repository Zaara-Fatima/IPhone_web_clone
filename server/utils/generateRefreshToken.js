import jwt from 'jsonwebtoken'

export const generateRefreshToken = (user) => {
  return jwt.sign(
    {id: user._id},
    process.env.REFRESH_SECRET,
    {expiresIn: process.env.REFRESH_EXPIRE || '30d'}
  )
}
