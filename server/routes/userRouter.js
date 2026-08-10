import express from 'express'
import { login, logout, logoutAll, register } from '../controller/authController.js'
import { protect } from '../middleware/authMiddleware.js'
import { deleteUserById, getAllUser, getUserProfile, updatUserProfile } from '../controller/userController.js'

const router = express.Router()

router.post("/register", register)
router.post("/login",login)
router.post("/logout", logout)
router.post("/logoutAll", logoutAll)
router.get("/profiles", protect, getAllUser)
router.get("/:id", protect, getUserProfile)
router.put("/update/:id", protect, updatUserProfile)
router.delete("/deleteprofile/:id", protect, deleteUserById)

export default router