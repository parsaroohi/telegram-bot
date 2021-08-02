const Router = require("express").Router();
const Product = require("../model/product");
const Category = require("../model/category");

Router.get("/", (req, res) => {
    res.render("home");
});

Router.get("/products", async (req, res) => {
    const products = await Product.find().limit(20);
    res.render("productList", { products });
});

Router.get("/addProduct", async (req, res) => {
    const cats = await Category.find();
    res.render("addProduct", { cats });
})

Router.post("/addProduct", async (req, res) => {
    const product = new Product({
        name: req.body.name,
        price: req.body.price,
        link: req.body.link,
        cat: req.body.cat,
    })
    await product.save();
    res.redirect("/products")
})

module.exports = Router;