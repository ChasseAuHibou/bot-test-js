const TelegramApi = require("node-telegram-bot-api");
const { gameOption, againOption } = require("./options");
const token = "7659241216:AAGpYvOJtak-gytUI-7afg17aRlROhyWhYg";

const bot = new TelegramApi(token, { polling: true });

const chats = {};

bot.setMyCommands([
	{ command: "/start", description: "Начни сначала" },
	{ command: "/finebutton", description: "Нажми сюда" },
	{ command: "/game", description: "Смотри что умею" },
]);

const startGame = async (chatId) => {
	await bot.sendMessage(chatId, "Я загадал цифру от 0 до 9");
	const randomNumber = Math.floor(Math.random() * 10);
	chats[chatId] = randomNumber;
	await bot.sendMessage(chatId, "А ты угадай", gameOption);
};

const start = () => {
	bot.on("message", async (msg) => {
		const text = msg.text;
		const chatId = msg.chat.id;
		const firstName = msg.from.first_name;

		if (text === "/start") {
			await bot.sendSticker(
				chatId,
				"https://tlgrm.eu/_/stickers/8a1/9aa/8a19aab4-98c0-37cb-a3d4-491cb94d7e12/2.webp"
			);
			return bot.sendMessage(chatId, `Добро пожаловать, ${firstName}!`);
		}
		if (text === "/finebutton") {
			return bot.sendMessage(chatId, "Ты нажал на крутую кнопку)");
		}
		if (text === "/game") {
			return startGame(chatId);
		}
		return bot.sendMessage(chatId, "Я не понимаю о чем ты, обратись к меню");
	});

	bot.on("callback_query", (msg) => {
		const data = msg.data;
		const chatId = msg.message.chat.id;
		if (data === "/again") {
			return startGame(chatId);
		}
		if (data === chats[chatId]) {
			return bot.sendMessage(
				chatId,
				`Поздравляю, ты угадал цифру ${chats[chatId]}`,
				againOption
			);
		} else {
			return bot.sendMessage(
				chatId,
				`Упс ты не угадал, я загадал цифру ${chats[chatId]}`,
				againOption
			);
		}
	});
};

start();
