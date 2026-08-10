import express from "express"
import {
  createOrder,
  getmyOrders,
  getOrderbyId,
  updateOrdertoPaid,
  getOrder,
  updateOrderStatus,
} from "../controller/orderController.js"

import { protect } from "../middleware/authMiddleware.js"

const router = express.Router()


// ===============================
// USER ROUTES
// ===============================

// Create new order
router.post("/", protect, createOrder)

// Get logged in user's orders
router.get("/myorders", protect, getmyOrders)

// Get order by ID
router.get("/:id", protect, getOrderbyId)

// Mark order as paid
router.put("/:id/pay", protect, updateOrdertoPaid)


// ===============================
// ADMIN ROUTES
// ===============================

// Get all orders (with pagination)
router.get("/", protect, getOrder)


// Update order status (processing → shipped → delivered → cancelled)
router.put("/:id/status", protect, updateOrderStatus)


export default router