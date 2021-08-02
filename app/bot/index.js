const { Telegraf, session } = require("telegraf");
const LocalSession = require("telegraf-session-local");
const { mainButtons } = require("./utils/ButtonManager");
const KeyboardMiddleware = require("./middleware/KeyboardMiddleware");
const { START_MESSAGE } = require("./utils/MessageHandler");
const ActionMiddleware = require("./middleware/ActionMiddleware");
const SessionMiddleware = require("./middleware/SessionMiddleware");
let bot;

async function startBot() {
    bot = new Telegraf(process.env.BOT_TOKEN);
    await bot.launch();
    // for finding photo id:
    // bot.use((ctx, next) => {
    //     console.log(ctx.message);
    //     console.log(ctx.message.from); // for finding information of user
    //     next();
    // })
    bot.use(new LocalSession({
        database: "session.json"
    }));
    bot.use(KeyboardMiddleware);
    bot.use(SessionMiddleware);
    bot.use(ActionMiddleware);
    bot.start(ctx => {
        ctx.reply(
            START_MESSAGE, mainButtons
        )
    });
}

module.exports.startBot = startBot;

module.exports.sendPaymentResult = (isOk, chatId) => {
    if (bot) {
        if (isOk) {
            bot.telegram
                .sendMessage(chatId,
                    "پرداخت شما با موفقیت انجام شد. از لیست خریدها می توانید آموزش مدنظر را دانلود کنید.")
        }
    } else {
        bot.telegram.sendMessage(chatId, "خرید ناموفق بود.")
    }
}