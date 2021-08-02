const { MAIN_BUTTONS_TEXT, commentTypeButtons, productList, cartProductButtons, buyProductButtons } = require("../utils/ButtonManager");
const { categoryList: categoryListButtons } = require("../utils/ButtonManager");
const categoryList = require("../data/category.json");
const { CATEGORY_LIST, COMMENT, FAV_LIST, cartListMessage, USER_BUYS_LIST, CART_EMPTY } = require("../utils/MessageHandler");
const { STATE_LIST } = require("./SessionMiddleware");
const category = require("../../model/category");
const user = require("../../model/user");


module.exports = (ctx, next) => {
    if (!ctx.message) {
        return next();
    }
    const text = ctx.message.text;
    if (text) {
        if (Object.values(MAIN_BUTTONS_TEXT).includes(text)
            && EventListener[text]) {
            ctx.session.state = undefined;
            ctx.session.stateData = undefined;
            return EventListener[text](ctx);
        }
    }
    next();
}


const EventListener = {
    [MAIN_BUTTONS_TEXT.ONLINE_BUY]: async (ctx) => {
        const categoryList = await category.find();
        ctx.reply(CATEGORY_LIST, categoryListButtons(categoryList));
    },
    [MAIN_BUTTONS_TEXT.COMMENT]: (ctx) => {
        ctx.session.state = STATE_LIST.COMMENT_TYPE;
        ctx.session.stateData = undefined;
        ctx.reply(COMMENT, commentTypeButtons)
    },
    [MAIN_BUTTONS_TEXT.MY_BUYS]: (ctx) => {

    },
    [MAIN_BUTTONS_TEXT.FAV]: async (ctx) => {
        const User = await user.find({ telId: ctx.message.from.id })
            .populate("fav");
        if (User) {
            ctx.reply(FAV_LIST, productList(User.fav));
        } else {
            ctx.reply(FAV_LIST_EMPTY)
        }
    },
    [MAIN_BUTTONS_TEXT.CART]: async (ctx) => {
        const userTel = ctx.message?.from || ctx.update.callback_query.from;
        let User = await user.findOne({
            telId: userTel.id
        }).populate("cart.product");
        if (!User || User.cart.length === 0) {
            return ctx.reply(CART_EMPTY);
        }
        const cart = User.cart.map(item => {
            const newItem = item.product;
            newItem.shareUse = item.shareUse
            return ({ ...item.product, shareUse: item.shareUse })
        });
        ctx.reply(cartListMessage(cart), cartProductButtons(cart));
    },
    [MAIN_BUTTONS_TEXT.MY_BUYS]: async (ctx) => {
        const userTel = ctx.message.from;
        let User = await user.findOne({
            telId: userTel.id
        })
        ctx.reply(USER_BUYS_LIST, buyProductButtons(User.buys));
    }
}

module.exports.KeyboardEventListener = EventListener;