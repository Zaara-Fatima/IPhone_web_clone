import Session from "../models/Session.js";
import User from "../models/User.js";
import { generateAccessToken } from "../utils/generateAccessToken.js";
import { generateRefreshToken } from "../utils/generateRefreshToken.js";
import { hashToken } from "../utils/hashToken.js";
import cookie from "cookie-parser"
import jwt from "jsonwebtoken"

export const register = async (req, res) => {
  try {
      const { name, username, email, password, role, image } = req.body;
  if (!name || !username || !email || !password || !role || !image) {
    return res.status(400).json({
      success: false,
      message: "All fields are required",
    });
  }
  const userExist = await User.findOne({ email });

  if (userExist) {
    return res.status(400).json({
      success: false,
      message: "User already exists",
    });
  }

  const user = await User.create({
    name,
    username,
    email,
    password,
    role,
    image,
  });

  res.status(201).json({
    success: true,
    _id: user._id,
    name: user.name,
    username: user.username,
    email: user.email,
    role: user.role,
    image: user.image,
  });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
    })
  }

};

export const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Email and password required",
    });
  }

  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return res.status(401).json({
      message: "Invalid email or password",
    });
  }

  const isValidPassword =await user.matchPassword(password);
  if (!isValidPassword) {
    return res.status(401).json({
      message: "Invalid email or password",
    });
  }

  const refreshtoken= generateRefreshToken(user)
  const refreshTokenHash =hashToken(refreshtoken)

  const session = await Session.create({
    user: user._id,
    refreshTokenHash,
    ip:req.ip,
    userAgent: req.headers["user-agent"],
    expiresAt: new Date(
        Date.now() + 7 * 24 * 60 * 60 * 1000
    ),
  })

 const accessToken= generateAccessToken(user)

  res.cookie("refreshToken", refreshtoken,{
    httpOnly:true,
    secure: true,
    sameSite:"Strict",
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  })

  res.status(200).json({
    success: true,
    username: user.username,
    email: user.email,
    message:"Logging in Suucessfully",
    accessToken,
    
  })
};

// const user = await userModel.findById(req.user.id);

export const refreshTheToken= async (req, res) => {
    const token = req.cookies.refreshToken 
     if(!token){
        return res.status(401).json({
            messgae: "Token not found"
        })
     }
     let decoded
     try {
        decoded = jwt.verify(
            token,
            process.env.REFRESH_SECRET
        )
     } catch (error) {
        return res.status(401).json({
            message: "Invalid refresh token",
        })
     }
     
     const tokenHash = hashToken(token)
     const session = await Session.findOne({
        refreshTokenHash : tokenHash,
        revoked:false
     })

     if (!session) { return res.status(401).json({ message: "Invalid refresh token" }) }

     if (session.expiresAt < new Date()) {
        return res.status(401).json({
            message: "Session expired",
        });
    }

     const newRefreshToken= generateRefreshToken(decoded)
     session.refreshTokenHash= hashToken(newRefreshToken)
     session.expiresAt= new Date(
        Date.now() + 7 * 24 * 60 * 60 * 1000
     )

     await session.save()

     const accessToken = generateAccessToken(decoded)
     res.cookie("refreshToken", newRefreshToken, {
      httpOnly:true,
        secure: true,
        sameSite: "Strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
     })

     return res.status(200).json({
        success: true,
        accessToken,
    });
} 

export const logout = async (req, res)=>{
    const token = req.cookies.refreshToken
    if(!token){
        return res.status(400).json({
            message: "Token Not Found"
        })
    }

    const tokenHash = hashToken(token)
     const session = await Session.findOne({
        refreshTokenHash: tokenHash,
        revoked :false,
     })

      if (!session) { return res.status(401).json({ message: "Invalid refresh token" }) }
      session.revoked= true
      await session.save()
      res.clearCookie("refreshToken",{
        httpOnly: true,
        secure: true,
        sameSite: "Strict",
      })
    res.status(200).json({ message: "Logged out successfully" }) 
}

export const logoutAll= async (req, res)=>{
    const token = req.cookies.refreshToken
    if(!token){
        return res.status(400).json({
            message: "Token Not Found"
        })
    }
    let decoded
     try {
        decoded = jwt.verify(
            token,
            process.env.REFRESH_SECRET
        )
     } catch (error) {
        return res.status(401).json({
            message: "Invalid refresh token",
        })
     }
      const session = await Session.updateMany({
        user: decoded_id,
        revoked :false,
     },{
        revoked: true,
     })
     res.clearCookie("refreshToken",{
      httpOnly: true,
        secure: true,
        sameSite: "Strict",
     })
      await session.save()
      res.status(200).json({ message: "Logged out successfully" }) 
}