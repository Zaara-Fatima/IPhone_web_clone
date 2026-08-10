import Product from "../models/Product.js";

export const createProduct = async (req, res) => {
  if (Array.isArray(req.body)) {
    const products = req.body.map((items) => ({
      ...items,
      id: req.user._id,
    }));
    const product = await Product.insertMany(products);
    return res.status(201).json(products);
  }
  const product = await Product.create({
    name: req.body.name,
    image: req.file.path,
    description: req.body.description,
    brand: req.body.brand,
    category: req.body.category,
    price: req.body.price,
    countInStock: req.body.countInStock,
  });

  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
};

export const getProductById = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return res.status(404).json({
      message: "PRODUCT NOT FOUND",
    });
  }
  res.status(200).json(product);
};

export const getAllProducts = async (req, res) => {
  const product = await Product.find({});
  if (!product) {
    res.status(404).json({
      message: "PRODUCT NOT FOUND",
    });
  }
  res.json(product);
};

export const updateProduct= async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404).json({
      message: "PRODUCT NOT FOUND",
    });
  }

  const {name ,img ,description ,category ,price ,countInStock ,isActive}= req.body
  product.name = name || product.name
  product.img = img || product.img
  product.description = description || product.description
  product.category = category || product.category
  product.price = price || product.price
  product.countInStock = countInStock || product.countInStock
  product.isActive = isActive || product.isActive

  const updatedProduct = await product.save()
  res.json(updatedProduct)
};

export const deleteProduct = async (req,res) => {
    const product = await Product.findById(req.params.id)
    if(!product){
        return res.status(404).json({
            message:"Product NOt Found"
        })
    }

    await product.deleteOne()
    res.json({
        message: "PRODUCT DELETED"
    })
}