const mongoose = require("mongoose");
const { ProductSchema } = require("./product");

const Schema = new mongoose.Schema({
    telId: Number,
    first_name: String,
    username: Number,
    gender: {
        type: String,
        enum: ["male", "female"],
        default: "male"
    },
    fullName: String,
    phone: String,
    fav: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "product"
    }],
    cart: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "product"
        },
        share: Boolean
    }],
    buys: [{
        product: [ProductSchema],
        status: Boolean,
        authority: String,
        ref: String,
        amount: Number,
    }],
});

module.exports = mongoose.model("user", Schema);

module.exports.createUser = async (userTel, saveUser = true) => {
    const User = new user({
        telId: userTel.id,
        first_name: userTel.first_name,
        username: userTel.username
    });
    if (saveUser) {
        await User.save();
    }
    return User;
}