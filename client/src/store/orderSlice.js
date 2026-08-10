import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import {
  createOrder,
  fetchMyOrders,
  fetchOrderById,
  payOrder,
  fetchAllOrders,
  deliverOrder,
  updateOrderStatus,
} from "../api/ordersApi"

// ========================
// THUNKS
// ========================
export const createOrderThunk = createAsyncThunk(
  "orders/create",
  async (orderData, { rejectWithValue }) => {
    try {
      return await createOrder(orderData)
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to create order")
    }
  }
)

export const fetchMyOrdersThunk = createAsyncThunk(
  "orders/fetchMine",
  async (_, { rejectWithValue }) => {
    try {
      return await fetchMyOrders()
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch orders")
    }
  }
)

export const fetchOrderByIdThunk = createAsyncThunk(
  "orders/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      return await fetchOrderById(id)
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Order not found")
    }
  }
)

export const payOrderThunk = createAsyncThunk(
  "orders/pay",
  async ({ id, paymentResult }, { rejectWithValue }) => {
    try {
      return await payOrder(id, paymentResult)
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Payment failed")
    }
  }
)

export const fetchAllOrdersThunk = createAsyncThunk(
  "orders/fetchAll",
  async (page, { rejectWithValue }) => {
    try {
      return await fetchAllOrders(page)
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch all orders")
    }
  }
)

export const deliverOrderThunk = createAsyncThunk(
  "orders/deliver",
  async (id, { rejectWithValue }) => {
    try {
      return await deliverOrder(id)
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to update delivery")
    }
  }
)

export const updateOrderStatusThunk = createAsyncThunk(
  "orders/updateStatus",
  async ({ id, status }, { rejectWithValue }) => {
    try {
      return await updateOrderStatus(id, status)
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to update status")
    }
  }
)

// ========================
// SLICE
// ========================
const ordersSlice = createSlice({
  name: "orders",
  initialState: {
    orders: [],          // user's own orders or admin all orders
    selectedOrder: null, // single order detail page
    pages: 1,            // for admin pagination
    page: 1,
    loading: false,
    error: null,
  },
  reducers: {
    clearSelectedOrder(state) {
      state.selectedOrder = null
    },
    clearOrderError(state) {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Create order
      .addCase(createOrderThunk.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createOrderThunk.fulfilled, (state, action) => {
        state.loading = false
        state.selectedOrder = action.payload  // immediately show the created order
      })
      .addCase(createOrderThunk.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

      // Fetch my orders
      .addCase(fetchMyOrdersThunk.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchMyOrdersThunk.fulfilled, (state, action) => {
        state.loading = false
        state.orders = action.payload
      })
      .addCase(fetchMyOrdersThunk.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

      // Fetch order by ID
      .addCase(fetchOrderByIdThunk.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchOrderByIdThunk.fulfilled, (state, action) => {
        state.loading = false
        state.selectedOrder = action.payload
      })
      .addCase(fetchOrderByIdThunk.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

      // Pay order
      .addCase(payOrderThunk.fulfilled, (state, action) => {
        state.selectedOrder = action.payload  // updated order with isPaid: true
      })

      // Fetch all orders (admin)
      .addCase(fetchAllOrdersThunk.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchAllOrdersThunk.fulfilled, (state, action) => {
        state.loading = false
        state.orders = action.payload.orders
        state.pages = action.payload.pages
        state.page = action.payload.page
      })
      .addCase(fetchAllOrdersThunk.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

      // Deliver order (admin)
      .addCase(deliverOrderThunk.fulfilled, (state, action) => {
        state.selectedOrder = action.payload
      })

      // Update order status (admin)
      .addCase(updateOrderStatusThunk.fulfilled, (state, action) => {
        state.selectedOrder = action.payload.order
        // also update in list if present
        const index = state.orders.findIndex(o => o._id === action.payload.order._id)
        if (index !== -1) {
          state.orders[index] = action.payload.order
        }
      })
  },
})

export const { clearSelectedOrder, clearOrderError } = ordersSlice.actions
export default ordersSlice.reducer