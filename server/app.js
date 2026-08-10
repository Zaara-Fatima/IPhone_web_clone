import express from "express"
import productRouter from './routes/productRouter.js'
import cartRouter from './routes/cartRouter.js'
import orderRouter from './routes/orderRouter.js'
import userRouter from './routes/userRouter.js'



export const app = express() 

app.use(express.json())
app.use('/api/product', productRouter)
app.use('/api/cart', cartRouter)
app.use('/api/order', orderRouter)
app.use('/api/user', userRouter)

