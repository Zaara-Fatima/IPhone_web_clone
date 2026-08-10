import {configureStore} from '@reduxjs/toolkit'
import authSlice from './authSlice.js'
import ordersSlice from './orderSlice.js'
import productSlice from './productSlice.js'
import cartSlice from './cartSlice.js'

const store = configureStore({
    reducer:{
        auth:authSlice,
        product: productSlice,
        order: ordersSlice,
        cart: cartSlice
    }
})