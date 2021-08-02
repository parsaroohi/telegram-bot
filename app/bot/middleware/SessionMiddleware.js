const { productDetailButtons, MAIN_BUTTONS_TEXT, PhoneEnterButtons, mainButtons, userInfoSubmit } = require("../utils/ButtonManager");
const { productList: productListButtons } = require("../utils/ButtonManager");
const productList = require("../data/products.json");
const { PRODUCT_LIST, PRODUCT_NOT_FOUND, getProductDetail, SEARCH, COMMENT_SUBMIT, COMMENT_MESSAGE, adminComment, USER_INFO_SUBMIT, userInfoMessage } = require("../utils/MessageHandler");
const { KeyboardEventListener } = require("./KeyboardMiddleware");
const config = require("../../../config/default.json");
const product = require("../../model/product");
const { user } = require("../../model/user");


const STATE_LIST = {
    SEARCH: "search",
    COMMENT_TYPE: "commentType",
    COMMENT_ENTER: "commentEnter",
    SHARED_USE: "sharedUse",
    USER_INFO_ENTER: "userInfoEnter",
    USER_INFO_FULLNAME_ENTER: "userInfoFullNameEnter",
    USER_INFO_PHONE_ENTER: "userInfoPhoneEnter",
}


module.exports = (ctx, next) => {
    if (!ctx.session.state) {
        return next();
    }
    const state = ctx.session.state;
    const values = Object.values(STATE_LIST)
    if (values.includes(state)
        && EventListener[state]) {
        return EventListener[state](ctx, next);
    }
    next();
}


const EventListener = {
    [STATE_LIST.SEARCH]: async (ctx, next) => {
        ctx.session.state = undefined;
        if (ctx.message) {
            const text = ctx.message.text;
            const prod = await product.find({
                name: {
                    $regex: text
                }
            })
            ctx.reply(`شما بدنبال محصول ${ctx.message.text} هستید.`,
                productListButtons(prod));
        }
        else {
            next();
        }
    },
    [STATE_LIST.COMMENT_TYPE]: (ctx, next) => {
        ctx.session.state = undefined;
        if (ctx.update.callback_query) {
            const data = ctx.update.callback_query.data;
            ctx.session.state = STATE_LIST.COMMENT_ENTER;
            ctx.session.stateData = {
                commentType: data
            }
            ctx.reply(COMMENT_MESSAGE);
        }
        else {
            next();
        }
    },
    [STATE_LIST.COMMENT_ENTER]: (ctx, next) => {
        ctx.session.state = undefined;
        const commentType = ctx.session.stateData.commentType;
        ctx.session.stateData = undefined;
        if (ctx.message) {
            const text = ctx.message.text;
            ctx.telegram.sendMessage(config.get("adminId"),
                adminComment({
                    type: commentType,
                    text: text
                }), ctx.message.from);
            ctx.session.stateData = undefined;
            ctx.reply(COMMENT_SUBMIT);
        }
        else {
            next();
        }
    },
    [STATE_LIST.USER_INFO_FULLNAME_ENTER]: (ctx, next) => {
        ctx.session.state = undefined;
        if (ctx.message) {
            const fullName = ctx.message.text;
            ctx.session.stateData = { ...ctx.session.stateData, fullName };
            ctx.session.state = STATE_LIST.USER_INFO_PHONE_ENTER;
            ctx.reply(USER_INFO_PHONE, PhoneEnterButtons);
        }
        else {
            next();
        }
    },
    [STATE_LIST.USER_INFO_PHONE_ENTER]: async (ctx, next) => {
        if (ctx.message?.text || ctx.message?.contact) {
            const phone = ctx.message?.text || ctx.message.contact.phone_number;
            const userTel = ctx.message.from;
            let User = await user.findOne({ telId: userTel.id });
            User.phone = phone;
            User.fullName = ctx.session.stateData.fullName;
            User.gender = ctx.session.stateData.gender;
            await User.save();
            ctx.session.state = undefined;
            ctx.session.stateData = undefined;
            await ctx.reply(USER_INFO_SUBMIT, mainButtons);
            ctx.reply(userInfoMessage(User),
                userInfoSubmit);
        }
    }
}


module.exports.STATE_LIST = STATE_LIST;