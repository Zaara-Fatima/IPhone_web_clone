import mongoose from "mongoose"
import Product from "../models/Product.js"
import Order from "../models/Order.js"

export const createOrder= async (req,res) => {
    const session = await mongoose.startSession()
    session.startTransaction()
    try {
         const { orderItems, shippingAddress, paymentMethod } = req.body

    if (!orderItems || orderItems.length === 0) {
      res.status(400)
      throw new Error("No order items")
    }

    // 1️⃣ Fetch products from DB
    const itemsFromDB = await Product.find({
      _id: { $in: orderItems.map((item) => item.product) },
    }).session(session)

    // 2️⃣ Calculate prices server-side
    let itemsPrice = 0

    const updatedOrderItems = orderItems.map((item) => {
      const product = itemsFromDB.find(
        (p) => p._id.toString() === item.product
      )

      if (!product) {
        throw new Error("Product not found")
      }

      if (product.countInStock < item.qty) {
        throw new Error("Insufficient stock")
      }

      itemsPrice += product.price * item.qty

      return {
        product: product._id,
        name: product.name,
        image: product.image,
        price: product.price,
        qty: item.qty,
      }
    })

    const taxPrice = Number((0.1 * itemsPrice).toFixed(2))
    const shippingPrice = itemsPrice > 1000 ? 0 : 50
    const totalPrice = itemsPrice + taxPrice + shippingPrice

    // 3️⃣ Reduce stock
    for (const item of updatedOrderItems) {
      await Product.updateOne(
        { _id: item.product },
        { $inc: { countInStock: -item.qty } },
        { session }
      )
    }

    // 4️⃣ Create order
    const order = new Order({
      user: req.user._id,
      orderItems: updatedOrderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
      status: "processing",
    })

    const createdOrder = await order.save({ session })

    await session.commitTransaction()
    session.endSession()

    res.status(201).json(createdOrder)

    } catch (error) {
        await session.abortTransaction();
    session.endSession();

    res.status(500).json({
        message: error.message
    });
    }
}

export const getmyOrders= async (req,res) => {
  const orders = await Order.find({user: req.user._id})
  res.json(orders)
}

export const getOrderbyId = async (req, res) => {
  const order = await Order.findById(req.params.id).populate("user", "name email")
    if (!order) {
    res.status(404)
    throw new Error("Order not found")
  }

  res.json(order)
}

export const updateOrdertoPaid= async (req,res) => {
  const order = await Order.findById(req.params.id)
  if(!order){
    res.status(404)
    throw new Error("Order not found")
  }

  order.isPaid= true
  order.paidAt= Date.now()
  order.paymentResult = {
    id: req.body.id,
    status: req.body.status,
    update_time: req.body.update_time,
    email_address: req.body.email_address,
  }

  const updatedOrder = await order.save()
  res.json(updatedOrder)
}

export const getOrder= async(req, res)=>{
  const pageSize= 10
  const page = Number(req.query.page) || 2
  const orders = await Order.find({ }). populate("user",  "id name").limit(pageSize).skip(pageSize *(page -1 ))
  res.json({
    orders,
    page,
    pages: Math.ceil(count / pageSize),
  })
}

export const updateOrderStatus = async (req, res) => {
  try {
     const {status}= req.body

  const allowedStatuses =["processing", "shipped","delivered", "cancelled"]
  if(!allowedStatuses.includes(status)){
    return res.status(400).json({
        success: false,
        message: "Invalid order status",
      })
  }
  const order = await Order.findById(req.params.id)
  if(!order){
    return res.status(404).json({
        success: false,
        message: "Order not found",
      })
  }

  if(order.status === "cancelled"){
    return res.status(400).json({
        success: false,
        message: "Cannot modify a cancelled order",
      })
  }

  if(order.status === "delivered" && status !== "delivered"){
    return res.status(400).json({
        success: false,
        message: "Delivered order cannot change status",
      })
  }

  order.status = status
  if (status === "delivered") {
      order.deliveredAt = Date.now()
    }
  
    const updateOrder = await order.save()
    res.json({
      success: true,
      message: "Order status updated",
      order: updatedOrder,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
    })
  }
}