import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String, required: true },
  quantity: { type: Number, require: true, default: 1 },
  price: {
    type: Number,
    required: true,
  },
});

const Cart = mongoose.model( "Cart", cartSchema)
export default Cart