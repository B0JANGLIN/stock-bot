const auth = require('./auth.json');
const Discord = require('discord.js');
const client = new Discord.Client();
var jsdom = require('jsdom');
const { JSDOM } = jsdom;
const { window } = new JSDOM();
const { document } = (new JSDOM('')).window;
global.document = document;
var $ = jQuery = require('jquery')(window);

let metrics = (words, msg) => {
    let metric = null;
    let symbol = null;
    words.forEach(word => {
        if (word === word.toUpperCase())
            symbol = word;
        else {
            switch (word) {
                case 'price':
                case 'p':
                    metric = 'price';
                    break;
                case 'growth':
                case 'g':
                    metric = 'growth';
                    break;
                case 'valuation':
                case 'value':
                case 'val':
                case 'v':
                    metric = 'valuation';
                    break;
                case 'margin':
                case 'm':
                    metric = 'margin';
                    break;
                case 'management':
                    metric = 'management';
                    break;
                case 'pershare':
                case 'per':
                case 'share':
                case 'perShare':
                    metric = 'perShare';
                    break;
                case 'financial':
                case 'financialStrength':
                case 'strength':
                case 'fs':
                    metric = 'financialStrength';
                    break;
            }
        }
    });
    if (symbol && metric) {
        $.get(`https://finnhub.io/api/v1/stock/metric?symbol=${symbol}&metric=${metric}&token=${auth.earnings_key}`, data => {
            msg.channel.send('i have data about ' + symbol);
        });
    } else {
        return msg.channel.send(`That didn't work. Try 'price', 'valuation', 'growth', 'margin', 'management', 'financialStrength' or 'perShare'`);
    }
}

let financials = (words, msg) => {
    let statement = null;
    let frequency = null;
    let symbol = null;
    words.forEach(word => {
        if (word === word.toUpperCase())
            symbol = word;
        else {
            switch (word) {
                case 'balancesheet':
                case 'bs':
                    statement = 'balance-sheet-statement';
                    break;
                case 'income':
                case 'ic':
                    statement = 'income-statement';
                    break;
                case 'cashflow':
                case 'cf':
                    statement = 'cash-flow-statement';
                    break;
                case 'q':
                case 'quart':
                case 'quarter':
                case 'quarterly':
                    frequency = 'quarter';
            }
        }
    });
    if (symbol) {
        $.get(`https://financialmodelingprep.com/api/v3/financials/${statement ? statement : 'balance-sheet-statement'}/${symbol}${frequency ? '?period=' + frequency : ''}`, data =>{
            if (data && data.symbol && data.financials) {
                let intro_string = `Here are ${symbol}'s latest ${frequency ? 'quarterly' : 'yearly'} financials:`;
                let financialData = data.financials[0];
                
                const messageEmbed = new Discord.MessageEmbed()
                .setColor('#0099ff')
                .setTitle(`${symbol}'s latest ${frequency ? 'quarterly' : 'yearly'} financials:`)
                // .setAuthor('Some name', 'https://i.imgur.com/wSTFkRM.png', 'https://discord.js.org')
                .addFields(
                    {name: 'Cash and equivalents', value: financialData['Cash and cash equivalents'], inline: true},
                    {name: 'Assets', value: financialData['Total current assets'], inline: true},
                    {name: 'Short-term investments', value: financialData['Short-term investments'], inline: true},
                    {name: 'Short-term debt', value: financialData['Short-term debt'], inline: true},
                    {name: 'Long-term debt', value: financialData['Long-term debt'], inline: true},
                    {name: 'Total debt', value: financialData['Total debt'], inline: true}
                )
                .setDescription('Some description here')
                .setThumbnail('https://cdn.discordapp.com/icons/687054731293884437/a8ea2f71aa8915f20a676989e5c7bd91.png?size=128')
                .setTimestamp()
                .setFooter('Some footer text here', 'https://cdn.discordapp.com/icons/687054731293884437/a8ea2f71aa8915f20a676989e5c7bd91.png?size=128');

                // msg.channel.send(intro_string);
                msg.channel.send(messageEmbed);
            }
        });
    }
}

var magic = (msg) => {
    let outcome = Math.floor(Math.random() * Math.floor(21));
    switch (outcome) {
        case 0:
            msg.reply('It is certain.');
            break;
        case 1:
            msg.reply('It is decidedly so.');
            break;
        case 2:
            msg.reply('Without a doubt.');
            break;
        case 3:
            msg.reply('Yes – definitely.');
            break;
        case 4:
            msg.reply('You may rely on it.');
            break;
        case 5:
            msg.reply('As I see it, yes.');
            break;
        case 6:
            msg.reply('Most likely.');
            break;
        case 7:
            msg.reply('Outlook good.');
            break;
        case 8:
            msg.reply('Yes.');
            break;
        case 9:
            msg.reply('Signs point to yes.');
            break;
        case 10:
            msg.reply('Reply hazy, try again.');
            break;
        case 11:
            msg.reply('Ask again later.');
            break;
        case 12:
            msg.reply('Better not tell you now.');
            break;
        case 13:
            msg.reply('Cannot predict now.');
            break;
        case 14:
            msg.reply('Concentrate and ask again.');
            break;
        case 15:
            msg.reply('Don’t count on it.');
            break;
        case 16:
            msg.channel.send('Yikes.');
            break;
        case 17:
            msg.reply('Probably not.');
            break;
        case 18:
            msg.reply('Eh.');
            break;
        case 19:
            msg.reply('Doubt it.');
            break;
        case 20:
            msg.reply('No.');
            setTimeout(() => {
                msg.reply('Also, shame on you.');
            }, 2000);
    }
}

client.on('ready', () => {
    console.log('all logged in!!!!');
});

client.on('message', msg => { 
    if(msg.author.bot) return;
    if (msg.content.substring(0, 1) !== '!') return;
    let phrases = msg.content.substring(1).split(' ');
    let found_home = false;
    console.log('phrases :', phrases);
    for (let i = 0; i < phrases.length; i++) {
        let word = phrases[i];
        switch(word) {
            case 'met':
            case 'metrics':
            case 'price':
            case 'growth':
            case 'valuation':
            case 'margin':
            case 'management':
            case 'perShare':
            case 'financialStrength':
                metrics(phrases, msg);
                found_home = true;
                break;
            case 'fin':
            case 'financials':
            case 'balancesheet':
            case 'bs':
            case 'income':
            case 'ic':
            case 'cashflow':
            case 'cf':
                financials(phrases, msg);
                found_home = true;
                break;
            case '8':
                magic(msg);
                found_home = true;
                break;
        }
        if (found_home) i = phrases.length;
    }
    if (!found_home) {
        msg.reply(`I couldn't figure that one out`);
    }
});

client.login(auth.token);