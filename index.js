const auth = require('./auth.json');
const Discord = require('discord.js');
const client = new Discord.Client();
var jsdom = require('jsdom');
const { JSDOM } = jsdom;
const { window } = new JSDOM();
const { document } = (new JSDOM('')).window;
global.document = document;
var $ = jQuery = require('jquery')(window);
const millify = require('millify');

let createCloseButton = async (msg) => {
    let filter = r => {return r.emoji.name === '❌'};
    
        const collector = msg.createReactionCollector(filter);
        let reaction = await msg.react('❌');

        let reactTimer = undefined;
        
        reactTimer = setTimeout(() => {
                collector.stop();
        }, 120000);

        collector.on('collect', r => {
            if (r.count >= 2) {
                collector.stop();
                clearTimeout(reactTimer);
            }
        });
        collector.on('end', r => {
            if (collector.total >= 2) 
                msg.delete();
            else 
                reaction.remove();
        });
}

let cleanup = (msg) => {
    msg.channel.messages.fetch().then(message_map => {

        for (let items of message_map) {
            let snowflake = items[0];
            console.log(`deleting message:: ${snowflake}`);
            let message = items[1];
            if (message.content.substring(0, 1) === '?' || message.author.bot) {
                message.delete();
            }
        }
    });

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
                case 'balance':
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
                case 'quarter':
                case 'quarterly':
                    frequency = 'quarter';
            }
        }
    });
    if (symbol) {
        $.get(`https://financialmodelingprep.com/api/v3/financials/${statement ? statement : 'balance-sheet-statement'}/${symbol}${frequency ? '?period=' + frequency : ''}`, async data =>{
            if (data && data.symbol && data.financials) {
                if (statement) statement = statement.split('-').join(' ');
                let intro_string = `Here are ${symbol}'s latest ${frequency ? 'quarterly' : 'yearly'} financials:`;
                let financialData = data.financials[0];
                console.log('financialData :', financialData);
                
                const messageEmbed = new Discord.MessageEmbed()
                .setColor('#0099ff')
                .setTitle(`${symbol}'s latest ${frequency ? 'quarterly' : 'yearly'} financials:`)
                // .setAuthor('Some name', 'https://i.imgur.com/wSTFkRM.png', 'https://discord.js.org')
                .setDescription(`Data from ${financialData['date']} ${statement ? statement : 'balance sheet'}`)
                .setTimestamp()
                .setFooter(`I love you`, 'https://cdn.discordapp.com/icons/687054731293884437/a8ea2f71aa8915f20a676989e5c7bd91.png?size=128');

                for (let key in financialData) {
                    if (key !== 'date') {
                        let original = parseFloat(financialData[key]);
                        if (typeof original === 'number' && original !== 0) {
                            let num_str = millify.default(original, {
                                precision: 2,
                                lowercase: true
                            });
                            if (num_str && num_str.length) {
                                messageEmbed
                                    .addField(key, num_str, true)
                            }
                        }
                    }
                }

                // msg.channel.send(intro_string);
                let sent_message = await msg.channel.send(messageEmbed);
                createCloseButton(sent_message);
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

var getQuote = (symbol, msg) => {

    $.get(`https://financialmodelingprep.com/api/v3/quote/${symbol}`, async data => {
        let quote_data = data[0];
        
        const messageEmbed = new Discord.MessageEmbed()
            .setColor('#0099ff')
            .setTitle(`${symbol}: `)
            .setDescription(`${millify.default(quote_data["price"], {lowercase: true})}`)
            .setTimestamp()
            .addField(`${quote_data["changesPercentage"] > 0 ? '+' : ''}$${millify.default(quote_data["change"], {precision: 1, lowercase: true})} ( ${quote_data["changesPercentage"] > 0 ? '+' : ''}${millify.default(quote_data["changesPercentage"], {precision: 1, lowercase: true})}% )`, '\u200B', false)
            .addField("Today's Low", millify.default(quote_data["dayLow"], {lowercase: true}), true)
            .addField('\u200B', '\u200B', true)
            .addField("Today's High", millify.default(quote_data["dayHigh"], {lowercase: true}), true)
            .addField("Year's Low", millify.default(quote_data["yearLow"], {lowercase: true}), true)
            .addField('\u200B', '\u200B', true)
            .addField("Year's High", millify.default(quote_data["yearHigh"], {lowercase: true}), true)
            .addField("Market Cap", millify.default(quote_data["marketCap"], {precision: 1, lowercase: true}), true)
            .addField("Price Avg 50", millify.default(quote_data["priceAvg50"], {precision: 1, lowercase: true}), true)
            .addField("Price Avg 200", millify.default(quote_data["priceAvg200"], {precision: 1, lowercase: true}), true)
            .addField("Volume", millify.default(quote_data["volume"], {precision: 1, lowercase: true}), true)
            .addField('\u200B', '\u200B', true)
            .addField("Average Volume", millify.default(quote_data["avgVolume"], {precision: 1, lowercase: true}), true);

        let sent_message = await msg.channel.send(messageEmbed);
        createCloseButton(sent_message);
    });
}

var getCommands = async (msg) => {
    const messageEmbed = new Discord.MessageEmbed()
            .setColor('#0099ff')
            .setTitle(`Function Examples: `)
            .setDescription(`*** stock symbols must be capitalized ***`)
            .addField(`Magic 8 ball`, 'ex: ?8 Gonna make some sweet tendies today?', false)
            .addField("Stock Quotes", 'ex: ?TSLA', false)
            .addField('Company Financials', '(defaults to yearly)', false)
            .addField('Balance Sheet', '?TSLA [balancesheet | balance | bs] q|uarter|ly', true)
            .addField('Income Statement', '?TSLA [income | ic] q|uarter|ly', true)
            .addField('Cash Flow', '?TSLA [cashflow | cf] q|uarter|ly', true)
    let sent_message = await msg.channel.send(messageEmbed);
    createCloseButton(sent_message);
}

client.on('ready', () => {
    console.log('all logged in!!!!');
});

client.on('message', msg => { 
    if(msg.author.bot) return;
    if (msg.content.substring(0, 1) !== '?') return;
    let phrases = msg.content.substring(1).split(' ');
    let found_home = false;
    console.log('phrases :', phrases);
    if (!found_home) {
        for (let i = 0; i < phrases.length; i++) {
            let word = phrases[i];
            switch(word) {
                case 'cleanup':
                case 'clean':
                    cleanup(msg);
                    found_home = true;
                    break;
                case 'fin':
                case 'financials':
                case 'balancesheet':
                case 'balance':
                case 'bs':
                case 'income':
                case 'ic':
                case 'cashflow':
                case 'cf':
                    financials(phrases, msg);
                    found_home = true;
                    break;
                case 'e':
                case 'earn':
                case 'earnings':
                    earnings(phrases, msg);
                    found_home = true;
                    break;
                case 'cmd':
                case 'c':
                case 'command':
                case 'commands':
                case 'function':
                case 'functions':
                case 'help':
                    getCommands(msg);
                    found_home = true;
                    break;
                case '8':
                    magic(msg);
                    found_home = true;
                    break;
            }
            if (found_home) i = phrases.length;
        }
        let reg = /^[A-Z]+$/;
        if (phrases.length === 1 && reg.test(phrases[0])) {
            getQuote(phrases[0], msg);
            found_home = true;
        }
    }
    if (!found_home) {
        msg.reply(`I couldn't figure that one out`);
    }
});

client.login(auth.token);