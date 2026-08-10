import jwt from 'jsonwebtoken'

export const generateAccessToken = (user) => {
   return jwt.sign(
    {id: user._id},
    process.env.ACCESS_SECRET,
    {expiresIn: process.env.ACCESS_EXPIRE || '15min'}
   )
}
