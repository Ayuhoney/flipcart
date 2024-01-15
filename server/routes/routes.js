const express = require("express");
const router = express.Router();
const dotenv = require('dotenv');
dotenv.config();
const apiKey = process.env.RAZOR_PAY_API_KEY;
const apiSecret = process.env.RAZOR_PAY_API_SECRET
const crypto = require('crypto')


// controllers-------------------
const fetchProducts = require("../controllers/fetchProducts");
const signUp = require("../controllers/signUp");
const logIn = require("../controllers/logInUser");
const fetchProductDetails = require("../controllers/fetchProductDetails");
const buyProduct = require("../controllers/singleOrder");
const placeOrder = require("../controllers/placeOrder");
const placeOrders = require("../controllers/placeOrders")
const orders = require("../controllers/orders");
const Order = require("../models/order-model");
// -----------------------------

router.get("/fetchProducts", fetchProducts)
router.post("/signup", signUp)
router.post("/login", logIn)
router.post("/productDetails", fetchProductDetails)
router.post("/buyProduct", buyProduct)
router.post("/placeOrder", placeOrder)
router.post("/placeOrders", placeOrders)
router.post("/orderHistory", orders)

router.post("/paymentVerification", async (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, product, userName } = req.body;
    

    const sha = crypto.createHmac("sha256", apiSecret)
    sha.update(`${razorpay_order_id}|${razorpay_payment_id}`)
    const digest = sha.digest("hex");

    const date = new Date()
    product.purchasedDate = date;
    if (digest == razorpay_signature) {

        const data = await Order.findOne({ username:userName });
        console.log(data);
      
        
        if (!data) {

            const data = new Order({ username: userName, orders: [product] })
            await data.save();
            res.status(200).json({ msg: "order completed successfully! last stage" })
        }
        else {
            // retrieve it and push items
            data.orders.push(product)
            await data.save();
            console.log("product added");

        }
    } else {
        res.status(501).json({ msg: "Transaction is not legit" })
    }



})


router.get("/getKey", (req, res) => {
    res.status(200).json({ key: apiKey })
})


module.exports = router