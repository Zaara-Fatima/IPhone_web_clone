import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { updatePost } from "./postSlice";

import { getProductById, deleteProduct, updateProduct, createProduct, getProducts } from "../api/productsApi"

const initialState ={
    items:[],
    selectedProducts: null,
    loading: false,
    error:null,
}

export const getproductThunk= createAsyncThunk("products/getAll", async(_,{rejectWithValue})=>{
    try {
        return await getProducts()
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "failed to fetch Products")
    }
})

export const getProductByIdThunk=createAsyncThunk("products/getProductById",async(id,{rejectWithValue})=>{
    try {
        return await getProductById(id)
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Failed to fetch Product")
    }
})

export const createProductThunk =createAsyncThunk("products/createProduct",async(data,{rejectWithValue})=>{
    try {
        return await createProduct(data)
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Failed to create Product")
    }
})

export const updateProductThunk =createAsyncThunk("products/updateProduct", async({data,id},{rejectWithValue})=>{
    try {
        return await updateProduct(data,id)
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Failed to update Product")
    }
})

export const deleteProductThunk =createAsyncThunk("products/deleteProduct",async(id,{rejectWithValue})=>{
    try {
         await deleteProduct(id)
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "failed to delete Product")
    }
})

const productsSlice =createSlice({
    name:'products',
    initialState,
    reducers:{
       clearSelectedProducts(state){
        state.selectedProducts =null
       }
    },
    extraReducers:(builder)=>builder
    .addCase(getproductThunk.pending,(state)=>{
        state.loading=true,
        state.error=null
    })
    .addCase(getproductThunk.fulfilled,(state,action)=>{
        state.loading=false,
        state.items= action.payload
    })
    .addCase(getproductThunk.rejected,(state,action)=>{
        state.loading=false,
        state.error =action.error.message
    })
    .addCase(getProductByIdThunk.fulfilled,(state,action)=>{
        state.selectedProducts=action.payload
    })
    .addCase(createProductThunk.fulfilled,(state,action)=>{
        state.items.push(action.payload)
    })
    .addCase(updateProductThunk.fulfilled,(state,action)=>{
        const index =state.items.findIndex(p=>p._id===action.payload._id)
        if(index !==-1){
            state.items[index]=action.payload
        }
    })
    .addCase(deleteProductThunk.fulfilled,(state,action)=>{
        state.items=state.items.filter(p=>p._id!==action.payload._id)
    })
})

export const { clearSelectedProducts} = productsSlice.actions;
export default productsSlice.reducer;
