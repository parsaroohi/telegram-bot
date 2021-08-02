module.exports.START_MESSAGE = `سلام، خوش آمدید.`;
module.exports.CATEGORY_LIST = `لطفا یکی از دسته های زیر را انتخاب نمایید.`;
module.exports.PRODUCT_LIST =
    `لطفا یکی از محصولات زیر را جهت نمایش اطلاعات بیشتر و افزودن به سبد خرید را انتخاب نمایید.`;
module.exports.PRODUCT_NOT_FOUND = "محصول مورد نظر پیدا نشد.";
module.exports.SEARCH = "نام محصول مورد نظر خود را بنویسید.";
module.exports.COMMENT = "لطفا نوع نظر خود را انتخاب کنید:"
module.exports.COMMENT_SUBMIT =
    "مشتری گرامی : درخواست شما در سیستم ثبت گردید و در اولین فرصت به این امر رسیدگی خواهد شد."
module.exports.COMMENT_MESSAGE = "لطفا موضوع موردنظر خود را تایپ نمایید:";
module.exports.FAV_ADDED = "محصول مورد نظر با موفقیت اضافه شد.";
module.exports.FAV_LIST = "محصولاتی که به لیست علاقمندی های شما اضافه شده است بصورت زیر است:";
module.exports.FAV_LIST_EMPTY = "لیست علافمندی های شما خالی است.";
module.exports.SHARED_USE_MSG = "نحوه ی استفاده از آموزش را انتخاب نمایید:";
module.exports.PRODUCT_ADDED_TO_CART = "محصول با موفقیت به سبد خرید شما اضافه شد.";
module.exports.PRODUCT_REMOVED_FROM_CART = "محصول با موفقیت از سبد شما حذف شد.";
module.exports.CART_EMPTY = "سبد خرید شما خالی است.";
module.exports.USER_INFO_GENDER = 'لطفا جنسیت خود را انتخاب کنید:';
module.exports.USER_INFO_FULLNAME = 'لطفا نام و نام خانوادگی خود را بنویسید:';
module.exports.USER_INFO_PHONE = 'لطفا شماره تلفن خود را ارسال فرمایید:';
module.exports.USER_INFO_SUBMIT = 'اطلاعات جدید شما با موفقیت ثبت شد.';
module.exports.USER_BUYS_LIST = "لیست خریدهای شما (ثبت شده یا نشده) در زیر آمده است."

module.exports.buyDetail = (buy) => `جزئیات خرید شما

لیست محصولات :
${buy.product.map((item, index) => `${index + 1}. ${item.name}`).join("\n")}

برای دانلود می توانید از لینک های زیر استفاده کنید.`

module.exports.buyFailDetail = (buy) => `جزئیات خرید شما

لیست محصولات :
${buy.product.map((item, index) => `${index + 1}. ${item.name}`).join("\n")}

می توانید خرید این لیست را همین حالا انجام دهید.`

module.exports.userInfoMessage = (user) => `
    اطلاعات شما به صورت زیر در سیستم ثبت است:

    جنسیت: ${user.gender === "male" ? "آقا" : "خانم"}
    نام و نام خانوادگی: ${user.fullName}
    تلفن: ${user.phone}
    `

module.exports.cartListMessage = (cart) => {
    return `سفارش شما شامل:
    
    ${cart.map((item, index) => `${index + 1}- ${item.name}  : ${item.price} تومان  (مخصوص استفاده ${item.shareUse ? "گروهی" : "تکی"})\n`).join("")}
    
    مبلغ قابل پرداخت: ${cart.reduce((acc, item) => acc + item.price, 0)} تومان`
};

module.exports.adminComment = (comment, user) =>
    `${comment.type === "COMMENT_CRITICAL" ? "یک انتقاد جدید" : "یک پیشنهاد جدید"}

    ${comment.text}
    
    کاربر : @${user.username}`

module.exports.getProductDetail = (product) =>
    `${product.name}

    ${product.meta ? product.meta.map(item => (`${item.key}:${item.value}`)).join("\n") : ""}
    وضعیت : ${product.exist ? "موجود" : "ناموجود"}
    ${product.price > 0 ? `قیمت : ${product.price} تومان` : "**رایگان**"}`;

module.exports.paymentMessage = (price) => `مبلغ قابل پرداخت برای شما:
${price} تومان

برای پرداخت می توانید از دکمه ی زیر استفاده کنید.`
