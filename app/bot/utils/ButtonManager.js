const { callback } = require("telegraf/typings/button")
const { convertArrayToNColumn } = require("./DataUtil")

const MAIN_BUTTONS_TEXT = {
    ONLINE_BUY: "خرید آنلاین",
    COMMENT: "پیشنهادات و انتقادات",
    CATALOG: "کاتالوگ",
    FAV: "علاقه مندیهای من",
    CART: "سبد خرید",
    MY_BUYS: "خریدهای من",
}


const mainButtons = {
    reply_markup: {
        resize_keyboard: true,
        keyboard: [
            [
                { text: MAIN_BUTTONS_TEXT.ONLINE_BUY },
                { text: MAIN_BUTTONS_TEXT.COMMENT },
                { text: MAIN_BUTTONS_TEXT.CATALOG }
            ],
            [
                { text: MAIN_BUTTONS_TEXT.FAV },
                { text: MAIN_BUTTONS_TEXT.CART },
                { text: MAIN_BUTTONS_TEXT.MY_BUYS }
            ]
        ]
    }
}


const categoryList = (data) => {
    return {
        reply_markup: {
            resize_keyboard: true,
            inline_keyboard:
                [...convertArrayToNColumn(data, 2)
                    .map(item => item.map(item => ({
                        text: item.title,
                        callback_data: `CAT_${item._id}`
                    }))),
                [
                    {
                        text: "جستجو",
                        callback_data: "search"
                    }
                ]],
        }
    }
}

const productList = (data) => {
    return {
        reply_markup: {
            resize_keyboard: true,
            inline_keyboard:
                [...convertArrayToNColumn(data, 2)
                    .map(item => item.map(item => ({
                        text: item.name,
                        callback_data: `PRODUCT_${item._id}`
                    }))),
                [
                    {
                        text: "بازگشت",
                        callback_data: "BACK_CAT"
                    }
                ]],
        }
    }
}


const productDetailButtons = (product, caption, existInFav, existInCart) => {
    let firstBtn;
    if (product.price > 0) {
        firstBtn = {
            text: existInCart ? "حذف از سبد خرید" : "افزودن به سبد خرید",
            callback_data: `CART_${prodcut._id}`
        }
    } else {
        firstBtn = {
            text: "دانلود",
            url: product.link
        }
    }
    return {
        reply_markup: {
            resize_keyboard: true,
            inline_keyboard: [
                [
                    firstBtn
                ],
                [
                    {
                        text: existInFav ? "حدف از لیست علاقمندیها" : "افزودن به لیست علاقه مندیها",
                        callback_data: `FAV_${product._id}`
                    }
                ],
                [
                    {
                        text: "بازگشت",
                        callback_data: `BACK_PRODUCT_${product.cat}`
                    }
                ]
            ]
        },
        caption
    }
}


const commentTypeButtons = {
    reply_markup: {
        resize_keyboard: true,
        inline_keyboard: [
            [
                {
                    text: "انتقاد",
                    callback_data: `COMMENT_CRITICAL`
                }
            ],
            [
                {
                    text: "پیشنهاد",
                    callback_data: `COMMENT_SUGGEST`
                }
            ]
        ]
    }
}


const sharedUseButtons = {
    reply_markup: {
        resize_keyboard: true,
        inline_keyboard: [
            [
                {
                    text: "استفاده تکی",
                    callback_data: `SAHRED_USE_FALSE`
                }
            ],
            [
                {
                    text: "استفاده گروهی",
                    callback_data: `SAHRED_USE_TRUE`
                }
            ]
        ]
    }
}


const productAddedToCartButtons = {
    reply_markup: {
        resize_keyboard: true,
        inline_keyboard: [
            [
                {
                    text: "افزودن سفارش دیگر",
                    callback_data: `BACK_CAT`
                },
                {
                    text: "مشاهده لیست خرید",
                    callback_data: `CART_LIST`
                }
            ],
            [
                {
                    text: "نهایی کردن خرید",
                    callback_data: `FINALIZE_BUY`
                }
            ],
            [
                {
                    text: "بازگشت",
                    callback_data: `BACK_CAT`
                }
            ]
        ]
    }
}


const cartProductButtons = (data) => {
    return {
        reply_markup: {
            resize_keyboard: true,
            inline_keyboard:
                [...data.map(item => ([{
                    text: `حذف ${item.name}`,
                    callback_data: `DELETE_${item._id}`
                }])),
                [
                    {
                        text: "افزودن سفارش دیگر",
                        callback_data: "BACK_CAT"
                    }
                ],
                [
                    {
                        text: "نهایی کردن خرید",
                        callback_data: "FINALIZE_BUY"
                    }
                ]],
        }
    }
}


const userInfoSubmit = {
    reply_markup: {
        resize_keyboard: true,
        inline_keyboard: [
            [
                {
                    text: "تایید و ادامه",
                    callback_data: `PAYMENT`
                }
            ],
            [
                {
                    text: "اطلاعات جدید می دهم",
                    callback_data: `RESET_USER_INFO`
                }
            ]
        ]
    }
}


const userInfoGender = {
    reply_markup: {
        resize_keyboard: true,
        inline_keyboard: [
            [
                {
                    text: "آقا",
                    callback_data: `USERINFO-GENDER_male`
                }
            ],
            [
                {
                    text: "خانم",
                    callback_data: `USERINFO-GENDER_female`
                }
            ]
        ]
    }
}


const PhoneEnterButtons = {
    reply_markup: {
        resize_keyboard: true,
        keyboard: [
            [
                {
                    text: "ارسال شماره ی همراه",
                    request_contact: true
                }
            ]
        ]
    }
}


const paymentButtons = (url) => ({
    reply_markup: {
        resize_keyboard: true,
        inline_keyboard: [
            [
                {
                    text: "پرداخت آنلاین",
                    url
                }
            ]
        ]
    }
})


const buyProductButtons = (data) => {
    return {
        reply_markup: {
            resize_keyboard: true,
            inline_keyboard:
                [...data.map((item, index) => ([{
                    text: `خرید ${index + 1}`,
                    callback_data: `BUYS-DETAIL_${item._id}`
                }]))]
        }
    }
}

const buyDetailButtons = (data) => {
    return {
        reply_markup: {
            resize_keyboard: true,
            inline_keyboard:
                [...data.product.map((item) => ([{
                    text: `دانلود ${item.name}`,
                    url: `${item.link}`
                }]))]
        }
    }
}

const buyDetailPaymentButtons = (id) => {
    return {
        reply_markup: {
            resize_keyboard: true,
            inline_keyboard: [
                [
                    {
                        text: "پرداخت",
                        callback_data: `BUY-PAYMENT_${id}`
                    }
                ]
            ]
        }
    }
}

module.exports = {
    MAIN_BUTTONS_TEXT,
    mainButtons,
    categoryList,
    productList,
    productDetailButtons,
    commentTypeButtons,
    sharedUseButtons,
    productAddedToCartButtons,
    cartProductButtons,
    userInfoSubmit,
    userInfoGender,
    PhoneEnterButtons,
    paymentButtons,
    buyProductButtons,
    buyDetailButtons,
    buyDetailPaymentButtons
}