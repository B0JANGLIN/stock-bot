const auth = require('./auth.json');
const Discord = require('discord.js');
const client = new Discord.Client();
var jsdom = require('jsdom');
const { JSDOM } = jsdom;
const { window } = new JSDOM();
const { document } = (new JSDOM('')).window;
global.document = document;
var $ = jQuery = require('jquery')(window);

let getInfo = (metric, symbol, msg) => {
    if (!['price', 'valuation', 'growth', 'margin', 'management', 'financialStrength', 'perShare'].includes(metric)) 
        return msg.reply(`That didn't work. Try 'price', 'valuation', 'growth', 'margin', 'management', 'financialStrength' or 'perShare'`);
    $.get(`https://finnhub.io/api/v1/stock/metric?symbol=${symbol}&metric=${metric}&token=${auth.earningsKey}`, data => {
        msg.reply('i have data about ' + symbol);
    });
}

let getFinancials = (metric, symbol, msg) => {
    msg.reply('jk');
}

client.on('ready', () => {
    console.log('all logged in!!!!');
});

client.on('message', msg => { 
    if(msg.author.bot) return;
    if (msg.content.substring(0, 1) !== '!') return;
    let phrases = msg.content.substring(1).split(' ');
    console.log('phrases :', phrases);
    let command = phrases[0];
    switch(command) {
        case 'info':
            getInfo(phrases[1], phrases[2], msg);
            break;
        case 'fin':
            getFinancials(phrases[1], phrases[2], msg);
            break;
        default:
            msg.reply(`I currently support 'fin' for financials, 'info' for metrics. Try '!info growth AAPL'`);
    }
});

client.login(auth.token);