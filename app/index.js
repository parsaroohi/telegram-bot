const { startBot } = require("./bot");
const mongoose = require("mongoose");
const category = require("./model/category");
const product = require("./model/product");
const express = require("express");
const productList = require("./bot/data/product.json");
const routes = require("./routes");
const bodyParser = require("body-parser");


class Application {
    constructor() {
        this.configApp();
        this.setupMongo();
        this.insertProduct();
        this.insertCategory();
        this.setupServer();
        startBot();
    }

    async insertCategory() {
        const cat = new category({
            title: "آموزش هوش مصنوعی"
        });
        await cat.save();
    }

    async insertProduct() {
        const prod = new product({
            name: "آموزش React توییتر",
            price: 190000,
            meta: [
                {
                    key: "کیفیت",
                    value: "عالی"
                }
            ],
            cat: "6065ac43...",
            exist: true,
            photo: "AgACAg..."
        });
        await prod.save();
    }

    setupServer() {
        const app = express();
        app.listen(3000, () => {
            console.log("app listen to port 3000");
        });
        app.use(bodyParser.urlencoded({
            extended: true
        }))
        app.use(routes);
        app.use(express.static("public"))
        app.set("view engine", "ejs")
    }

    setupMongo() {
        mongoose.connect("mongodb://localhost:27017/shopbot")
            .then(() => {
                console.log("db connected");
            }).catch(err => {
                console.log(err);
            });
    }

    configApp() {
        require("dotenv").config();
    }
}

module.exports = Application;