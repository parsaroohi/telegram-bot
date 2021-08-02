const Router = require("express").Router();
const Product = require("../model/product")
const ZarinpalCheckout = require('zarinpal-checkout');
const User = require("../model/user");
const { sendPaymentResult } = require("../bot/index")

const zarinpal = ZarinpalCheckout.create('00000000-0000-0000-0000-000000000000', true);


Router.get("/api/products", async (req, res) => {
    const products = await Product.find();
    res.send(products)
})

Router.get("/payment/verify", async (req, res) => {
    const user = await User.findOne({ "buys.authority": req.query.Authority })
    const buy = user.buys.find(item => {
        return item._doc.authority == req.query.Authority
    });
    zarinpal.PaymentVerification({
        Amount: buy.amount, // In Tomans
        Authority: req.query.Authority
    }).then(response => {
        if (response.status === -21) {
            sendPaymentResult(false, user.telId)
        } else {
            buy.status = true;
            buy.ref = response.RefID
            sendPaymentResult(true, user.telId)
            return user.save();
        }
    }).catch(err => {
        sendPaymentResult(false, user.telId)
        console.error(err);
    });
    res.render("payment", { success: req.query.Status === "OK", authority: req.query.Authority })
})

module.exports = Router;
