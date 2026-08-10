import Cart from "../models/Cart.js"

export const addToCart = async (req,res) => {
    try {
        if(Array.isArray(req.body)){
            const cartItems= req.body.map((item)=>({
                ...item, user: req.user._id
            }))
            const items = await Cart.insertMany(cartItems)
             return res.status(200).json(items)
        }
        const {name, quantity, price, image}= req.body
        const item = new Cart.create({
            name, 
            price,
            image,
            quantity: quantity || 1,
        })
        await item.save()
        res.status(200).json(item)
    } catch (error) {
        
    }
}

export const removeFromCart= async(req,res)=>{
    try {
        const item = await Cart.findById(req.params.id)
        if(!item){
            return res.status(404).json({
                message:"Item Not Found"
            })
        }

        await item.deletone()
        res.json({message: "Item removed"})
    } catch (error) {
        console.log(error.message)
        res.status(500).json({
            message:"Server Error"
        })
    }
}