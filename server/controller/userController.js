import User from "../models/User.js"

export const getUserProfile= async (req,res) => {
    const user = await User.findById(req.user._id).select("-password")
    if(!user){
        return res.status(404).json({
            message: "User Not Found"
        })
    }
    res.json(user)
}

export const updatUserProfile = async (req,res) => {
    const user = await User.findById(req.user._id)
    if(!user){
        return res.status(404).json({
            message: "USER NOT FOUND"
        })
    }

    user.email= req.body.email || user.email
    user.name= req.body.name || user.name
    user.username= req.body.username || user.username
    user.image= req.body.image || user.image

    if(req.body.password){
        user.password= req.body.password
    }

    const updatedUser = await user.save()
    res.json({
        name: updatedUser.name,
        username: updatedUser.username,
        email: updatedUser.email,
       image: updatedUser.image
    })
}

export const getAllUser=  async (req,res) => {
    const user = await User.find({}).select("-password")
    if(!user){
        return res.status(404).json({
            message: "USER NOT FOUND"
        })
    }
    res.json(user)
}

export const deleteUserById = async (req,res) => {
    const user = await User.findById(req.user._id)
    if(!user){
        return res.status(404).json({
            message: "USER NOT FOUND"
        })
    }
    await user.deleteOne()
    res.json({
        message: "USER WAS DELETED"
    })
}