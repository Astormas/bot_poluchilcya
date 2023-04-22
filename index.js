const TelegramApi = require('node-telegram-bot-api')
const {gameOptions, againOptions} = require('./options')
const token = '5937617723:AAF4stm1zinfW-YNbfrSfKfXdhPgZQv2IZY'

const bot = new TelegramApi(token, {polling: true})

const chats = {}


const startGame = async (chatId) => {
    await bot.sendMessage(chatId, `я загадаю цифру от 0 до 9, а ты угадай`);
    const randomNumber = Math.floor(Math.random() * 10) 
    chats[chatId] = randomNumber;
    await bot.sendMessage(chatId, `отгадывай`, gameOptions);
}

const start = () => {
    bot.setMyCommands( [
        {command: '/start', description: 'начальное привествие'},
        {command: '/info', description: 'Получить информацию о пользователе'},
        {command: '/game', description: 'игра угадай цифру'},
])

bot.on('message', async msg => {
    const text = msg.text;
    const chatId = msg.chat.id;

    if (text === '/start') {
        await bot.sendSticker(chatId, `https://tlgrm.ru/_/stickers/1a8/90e/1a890e3e-5e6d-4da8-8bcf-3663e928e1ed/6.webp` );
        return bot.sendMessage(chatId, `меня зовут петя и смотри что я умею ниже`);
    } 
    if (text === '/info') {
        return bot.sendMessage(chatId, `тебя зовут ${msg.from.first_name} ${msg.from.last_name}`);
    } 
    if (text === '/game') {
     return startGame(chatId);   
    }
    return bot.sendMessage(chatId, 'я тебя не понимаю, ясно выражайся')

})

bot.on('callback_query', async msg => {
    const data = msg.data;
    const chatId = msg.message.chat.id;
    if (data === '/again') {
        return startGame(chatId)
    }
    if (data === chats[chatId]) {
        return bot.sendMessage(chatId, `поздравляю, ты отгадал цифру ${chats[chatId]}`, againOptions)   
    } else {
        return bot.sendMessage(chatId, `к сожалению ты не угадал, цифра была ${chats[chatId]}`, againOptions)
    }
})
}

start ()