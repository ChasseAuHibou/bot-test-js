require("dotenv").config();
const {
	Bot,
	GrammyError,
	HttpError,
	Keyboard,
	InlineKeyboard,
} = require("grammy");
const { hydrate } = require("@grammyjs/hydrate");
const { text } = require("stream/consumers");

const bot = new Bot(process.env.BOT_API_KEY);
bot.use(hydrate());

bot.api.setMyCommands([
	{ command: "start", description: "Запуск бота" },
	{ command: "menu", description: "Получить меню" },
]);

bot.command("start", async (ctx) => {
	await ctx.reply("Привет я написан на GrammyJS", {
		parse_mode: "HTML",
	});
	console.log(ctx.me);
});

const menuKeyboard = new InlineKeyboard()
	.text("Узнать статус закза", "order-status")
	.text("Обратиться в поддержку", "support");

const backKeyboard = new InlineKeyboard().text("Назад в меню", "back");

bot.command("menu", async (ctx) => {
	await ctx.reply("Выбери пункт в меню", {
		reply_markup: menuKeyboard,
	});
});

bot.callbackQuery("order-status", async (ctx) => {
	await ctx.callbackQuery.message.editText("Статус заказа: в пути", {
		reply_markup: backKeyboard,
	});
	await ctx.callbackQuery();
});

bot.callbackQuery("support", async (ctx) => {
	await ctx.callbackQuery.message.editText("Номер поддержки: +3806314881312", {
		reply_markup: backKeyboard,
	});
	await ctx.callbackQuery();
});

bot.callbackQuery("back", async (ctx) => {
	await ctx.callbackQuery.message.editText("Выбери пункт в меню", {
		reply_markup: menuKeyboard,
	});
	await ctx.callbackQuery();
});

bot.catch((err) => {
	const ctx = err.ctx;
	console.error(`Error while handling update ${ctx.update.update_id}:`);
	const e = err.error;

	if (e instanceof GrammyError) {
		console.error("Error is request:", e.description);
	} else if (e instanceof HttpError) {
		console.error("Cloud not contact Telegram:", e);
	} else {
		console.error("Unknown error:", e);
	}
});

bot.start();
