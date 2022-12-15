const asyncHandler = require("express-async-handler");

const Product = require("../models/productModel");
const AppError = require("../middleWare/errorMiddleware");



//CREATE PRODUCT
const createProduct = asyncHandler(async (req,res,next)=>{
    const { name, sku, category, quantity, price, description } = req.body;

    //validation
    if (!name || !category || !quantity || !price || !description) {
        return next(new AppError("Please fill in all fields...",400));
    }

    // Handle Image upload
    let fileData = {};
    if(req.file) {
        try{
            // console.log(req.file);
            fileData= {
                fileName: req.file.originalname + Date.now().toString(),
                fileType: req.file.mimetype,
                fileSize: req.file.size,
                filePath: req.file.path,
            };
        }catch(error){
            return next(new AppError("Image could not be uploaded..."));
        }    
    }

    //create product
    const product = await Product.create({
        user: req.user.id,
        name,
        sku,
        category,
        quantity,
        price,
        description,
        image: fileData,
    });
    res.status(201).json(product);
    
})

module.exports = { createProduct };