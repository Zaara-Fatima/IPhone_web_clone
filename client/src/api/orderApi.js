import api from "./apiInstance";

// Create order
export const createOrder = async (orderData) => {
    const { data } = await api.post("/orders", orderData);
    return data;
};

// Logged in user's orders
export const fetchMyOrders = async () => {
    const { data } = await api.get("/orders/myorders");
    return data;
};

// Get order by ID
export const fetchOrderById = async (id) => {
    const { data } = await api.get(`/orders/${id}`);
    return data;
};

// Mark order as paid
export const payOrder = async (id, paymentResult) => {
    const { data } = await api.put(`/orders/${id}/pay`, paymentResult);
    return data;
};

// Admin - Get all orders
export const fetchOrders = async () => {
    const { data } = await api.get("/orders");
    return data;
};

// Admin - Mark delivered
export const deliverOrder = async (id) => {
    const { data } = await api.put(`/orders/${id}/deliver`);
    return data;
};

// Admin - Update status
export const updateOrderStatus = async (id, status) => {
    const { data } = await api.put(`/orders/${id}/status`, {
        status,
    });

    return data;
};