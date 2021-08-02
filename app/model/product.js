const mongoose = require("mongoose");

const Schema = new mongoose.Schema({
    name: String,
    photo: String,
    price: Number,
    exist: { type: Boolean, default: true },
    link: String,
    meta: [],
    cat: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "category"
    },
});

module.exports = mongoose.model("product", Schema);
module.exports.ProductSchema = Schema;