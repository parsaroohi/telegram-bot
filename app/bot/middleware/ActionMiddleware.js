const { productDetailButtons, MAIN_BUTTONS_TEXT, sharedUseButtons, productAddedToCartButtons, cartProductButtons, userInfoSubmit, userInfoGender, paymentButtons, buyDetailButtons, buyDetailPaymentButtons } = require("../utils/ButtonManager");
const { productList: productListButtons } = require("../utils/ButtonManager");
const productList = require("../data/products.json");
const { PRODUCT_LIST, PRODUCT_NOT_FOUND, getProductDetail, SEARCH, FAV_ADDED, SHARED_USE_MSG, PRODUCT_ADDED_TO_CART, PRODUCT_REMOVED_FROM_CART, CART_EMPTY, cartListMessage, userInfoMessage, USER_INFO_GENDER, USER_INFO_FULLNAME, paymentMessage, buyDetail, buyFailDetail } = require("../utils/MessageHandler");
const { KeyboardEventListener } = require("./KeyboardMiddleware");
const { STATE_LIST } = require("./SessionMiddleware");
const product = require("../../model/product");
const user = require("../../model/user");
const { createUser } = require("../../model/user");
const ZarinPal = require("zarinpal-checkout");
const zpal = ZarinPal.create('00000000-0000-0000-0000-000000000000', true);


const ActionMap = {
    CAT: /^CAT_\w+/,
    PRODUCT: /^PRODUCT_\w+/,
    BACK: /^BACK_\w+/,
    SEARCH: /^SEARCH/,
    FAV: /^FAV_\w+/,
    CART: /^CART_\w+/,
    CART_LIST: /^CART_LIST/,
    SAHRED_USE: /^SHARED_USE_\w+/,
    DELELE: /^DELETE_\w+/,
    FINALIZE_BUY: /^FINALIZE_BUY/,
    RESET_USER_INFO: /^RESET_USER_INFO/,
    USER_INFO_GENDER_ENTER: /^USER-INFO-GENDER_\w+/,
    PAYMENT: /^PAYMENT/,
    BUYS_DETAIL: /^BUYS-DETAIL_\w+/,
    BUY_PAYMENT: /^BUY-PAYMENT_\w+/
}


module.exports = (ctx, next) => {
    if (!ctx.update.callback_query) {
        return next();
    }
    const callback_data = ctx.update.callback_query.data;
    if (callback_data) {
        const actionValues = Object.values(ActionMap)
        for (let i = 0; i < actionValues.length; i++) {
            const isMatch = callback_data.match(actionValues[i]);
            if (isMatch
                && EventListener[Object.keys(ActionMap)[i]]) {
                return EventListener[Object.keys(ActionMap)[i]](ctx, isMatch);
            }
        }
    }
    next();
}


const EventListener = {
    CAT: async (ctx, match) => {
        const cat = match[0].split("_")[1];
        const products = await product.find({
            cat
        });
        ctx.reply(PRODUCT_LIST,
            productListButtons(products));
    },
    PRODUCT: async (ctx, match) => {
        const productId = match[0].split("_")[1];
        const data = await product.findById(productId);
        const userTel = ctx.update.callback_query.from.id;
        let User = await user.findOne({
            telId: userTel.id
        });
        if (data) {
            const existInFav = User?.fav?.includes(productId);
            const existInCart = User?.cart?.some(item => item.product == productId);
            if (data.photo) {
                await ctx.telegram.sendChatAction(ctx.chat.id, "upload_photo");
                await ctx.replyWithPhoto(data.photo,
                    productDetailButtons(data, getProductDetail(data), existInFav, existInCart));
            }
            ctx.reply(getProductDetail(data), productDetailButtons(data));
        }
        else {
            ctx.reply(PRODUCT_NOT_FOUND);
        }
    },
    BACK: (ctx, match) => {
        const where = match[0].split["_"][1];
        switch (where) {
            case "CAT":
                KeyboardEventListener[MAIN_BUTTONS_TEXT.ONLINE_BUY](ctx);
                break;
            case "PRODUCT":
                const cat = match[0].split["_"][2];
                EventListener.CAT(ctx, [`CAT_${cat}`]);
                break;
            default:
                break;
        }
    },
    SEARCH: (ctx) => {
        ctx.session.state = STATE_LIST.SEARCH;
        ctx.reply(SEARCH);
    },
    FAV: async (ctx, match) => {
        const productId = match[0].split["_"][1];
        const userTel = ctx.update.callback_query.from.id;
        let User = await user.findOne({
            telId: userTel.id
        });
        if (!User) {
            User = await createUser(userTel, false);
            User.fav = [productId];
        } else if (!User.fav.includes(productId)) {
            User.fav.push(productId);
        } else {
            User.fav = User.fav.filter(item => item != productId);
        }
        await User.save();
        const existInCart = User?.cart?.some(item => item.product == productId);
        ctx.telegram.editMessageReplyMarkup(ctx.update.callback_query.message.chat.id,
            ctx.update.callback_query.message.message_id,
            undefined,
            productDetailButtons({ _id: productId }, "", User.fav.includes(productId),
                existInCart).reply_markup);
        ctx.reply(FAV_ADDED);
    },
    CART: async (ctx, match) => {
        const productId = match[0].split["_"][1];
        const userTel = ctx.update.callback_query.from.id;
        let User = await user.findOne({
            telId: userTel.id
        });
        if (User) {
            const existInCart = User.cart.some(item => item.product == productId);
            if (existInCart) {
                User.cart = User.cart.filter(item => itme.prodcut != productId);
                ctx.telegram.editMessageReplyMarkup(ctx.update.callback_query.message.chat.id,
                    ctx.update.callback_query.message.message_id,
                    undefined,
                    productDetailButtons({ _id: productId }, "", User.fav.includes(productId),
                        !existInCart).reply_markup);
                ctx.reply(PRODUCT_REMOVED_FROM_CART);
                return await User.save();
            }
        }
        ctx.session.state = STATE_LIST.SHARED_USE;
        ctx.session.stateData = { productId };
        ctx.reply(SHARED_USE_MSG, sharedUseButtons);
    },
    SHARED_USE: async (ctx, match) => {
        const shareUse = match[0].split["_"][2];
        const isShareUse = shareUse === "TRUE";
        const userTel = ctx.update.callback_query.from.id;
        let User = await user.findOne({
            telId: userTel.id
        });
        if (!User) {
            User = await createUser(userTel, false);
        }
        if (User.cart.some(item => item.product == ctx.session.stateData.productId)) {
            User.cart.push({
                product: ctx.session.stateData.productId,
                share: isShareUse
            });
        }
        await User.save();
        await ctx.reply(PRODUCT_ADDED_TO_CART, productAddedToCartButtons);
        ctx.session.state = undefined;
        ctx.session.stateData = undefined;
    },
    CART_LIST: async (ctx) => {
        KeyboardEventListener[MAIN_BUTTONS_TEXT.CART](ctx);
    },
    DELETE: async (ctx, match) => {
        const productId = match[0].split["_"][1];
        const userTel = ctx.update.callback_query.from.id;
        let User = await user.findOne({
            telId: userTel.id
        }).populate("cart.product");
        if (User) {
            User.cart = User.cart.filter(item => item.product._id != productId);
            const cart = User.cart.map(item => item.product);
            await User.save();
            await ctx.telegram.editMessageText(ctx.update.callback_query.message.chat.id,
                ctx.update.callback_query.message.message_id,
                undefined,
                cartListMessage(cart), cartProductButtons(cart));
        }
    },
    FINALIZE_BUY: async (ctx) => {
        const userTel = ctx.update.callback_query?.from || ctx.message.from;
        let User = await user.findOne({
            telId: userTel.id
        });
        if (User) {
            if (Usre.fullName) {
                ctx.reply(userInfoMessage(User),
                    userInfoSubmit);
            } else {
                ctx.session.state = STATE_LIST.USER_INFO_ENTER;
                ctx.reply(USER_INFO_GENDER, userInfoGender)
            }
        } else {

        }
    },
    RESET_USER_INFO: async (ctx) => {
        const userTel = ctx.update.callback_query?.from || ctx.message.from;
        await user.findOneAndUpdate({
            telId: userTel.id
        }, {
            $unset: {
                fullName: "",
                phone: "",
                gender: ""
            }
        });
        await EventListener.FINALIZE_BUY(ctx);
    },
    USER_INFO_GENDER_ENTER: async (ctx, match) => {
        const gender = match[0].split["_"][1];
        ctx.session.stateData = { gender };
        ctx.session.state = STATE_LIST.USER_INFO_FULLNAME_ENTER;
        ctx.reply(USER_INFO_FULLNAME);
    },
    PAYMENT: async (ctx) => {
        const userTel = ctx.update.callback_query?.from || ctx.message.from;
        let User = await user.findOne({
            telId: userTel.id
        }).populate("cart.product");
        const price = User.cart.reduce((acc, item) => acc + item.product.price, 0);
        const response = await zpal.PaymentRequest({
            Amount: price + "",
            CallbackURL: 'http://localhost:3000/payment/verify',
            Description: 'A Payment from Node.JS',
            Email: 'hi@siamak.work',
            Mobile: '09120000000'
        });
        if (response.status == 100) {
            User.buys.push({
                product: User.cart.map(item => item.product),
                status: false,
                authority: response.authority,
                amount: price
            });
            User.cart = [];
            await User.save();
            ctx.reply(paymentMessage(price), paymentButtons(response.url));
        } else {

        }
    },
    BUYS_DETAIL: async (ctx, match) => {
        const buyId = match[0].split["_"][1];
        const userTel = ctx.update.callback_query?.from;
        let User = await user.findOne({
            telId: userTel.id
        })
        const buy = User.buys.find(item => item._id == buyId);
        if (buy.status) {
            ctx.reply(buyDetail(buy), buyDetailButtons(buy));
        } else {
            ctx.reply(buyFailDetail(buy), buyDetailPaymentButtons(buy._id))
        }
    },
    BUY_PAYMENT: async (ctx, match) => {
        const buyId = match[0].split["_"][1];
        const userTel = ctx.update.callback_query?.from;
        let User = await user.findOne({
            telId: userTel.id
        })
        User.cart = User.buys.find(item => item._id == buyId)
            .product.map(item => ({ product: item._id, shareUse: false }));
        User.buys = User.buy.filter(item => item._id != buyId);
        await User.save()
        await EventListener.CART_LIST(ctx, match);
    }
}
