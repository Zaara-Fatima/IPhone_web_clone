import api from "./apiInstance";

// Get all products
export const fetchProducts = async () => {
    const { data } = await api.get("/products");
    return data;
};

// Get single product
export const fetchProductById = async (id) => {
    const { data } = await api.get(`/products/${id}`);
    return data;
};

// Create product
export const createProduct = async (productData) => {
    const { data } = await api.post("/products", productData);

    return data;
};

// Update product
export const updateProduct = async (id, productData) => {
    const { data } = await api.put(`/products/${id}`, productData);

    return data;
};

// Delete product
export const deleteProduct = async (id) => {
    const { data } = await api.delete(`/products/${id}`);
    return data;
};