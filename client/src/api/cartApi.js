import api from "./apiInstance"

export const updateCartQuantity = async(id, quantity)=>{
    const {data}=await api.put(`/carts/${id}`,{quantity})
    return data
}


// Add item to cart
export const addToCart = async (cartData) => {
    const { data } = await api.post("/cart", cartData);
    return data;
};

// Remove item from cart
export const removeFromCart = async (id) => {
    const { data } = await api.delete(`/cart/${id}`);
    return data;
};