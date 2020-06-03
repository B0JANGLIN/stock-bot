const auth = require('./auth.json');
const MessageObjectFactory = require('./message-objects');
var jsdom = require('jsdom');
const { JSDOM } = jsdom;
const { window } = new JSDOM();
const { document } = (new JSDOM('')).window;
global.document = document;
var $ = jQuery = require('jquery')(window);
const millify = require('millify');


class GeneralMessageHandler {
    constructor() {}
    handleMessage(msg) {
        let phrases = msg.content.substring(1).split(' ');
        let found_home = false;
        console.log('GeneralMessageHandler::phrases :', phrases);
        if (!found_home) {
            for (let i = 0; i < phrases.length; i++) {
                let word = phrases[i];
                switch(word) {
                    case 'cleanup':
                    case 'clean':
                        this.cleanup(msg);
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
                        console.dir(`GeneralMessageHandler::routing to (financials) based on keyword [${word}]`);
                        this.financials(phrases, msg);
                        found_home = true;
                        break;
                    case 'e':
                    case 'earn':
                    case 'earnings':
                        this.earnings(phrases, msg);
                        found_home = true;
                        break;
                    case 'news':
                        console.dir(`GeneralMessageHandler::routing to (news) based on keyword [${word}]`);
                        this.news(phrases, msg);
                        found_home = true;
                        break;
                    case 'whats':
                    case "what's":
                    case 'what':
                    case 'whos':
                    case "who's":
                    case 'who':
                        console.dir(`GeneralMessageHandler::routing to (identify) based on keyword [${word}]`);
                        this.identify(phrases, msg);
                        found_home = true;
                        break;
                    case 'poll':
                        console.dir(`GeneralMessageHandler::routing to (poll) based on keyword [${word}]`);
                        this.poll(phrases, msg);
                        found_home = true;
                        break;
                    case 'commands':
                        console.dir(`GeneralMessageHandler::routing to (getCommands) based on keyword [${word}]`);
                        this.getCommands(msg);
                        found_home = true;
                        break;
                    case '8':
                        console.dir(`GeneralMessageHandler::routing to (magic) based on keyword [${word}]`);
                        this.magic(msg);
                        found_home = true;
                        break;
                    case 'tell':
                        console.dir(`GeneralMessageHandler::routing to (tellem) based on keyword [${word}]`);
                        this.tellem(phrases, msg)
                        break;
                    default:
                        let reg = /^[A-Za-z]+$/;
                        if (phrases.length === 1 && reg.test(phrases[0])) {
                            this.getQuote(phrases[0].toUpperCase(), msg);
                            found_home = true;
                        }
    
                }
                if (found_home) i = phrases.length;
            }
        }
    }

    cleanup = (msg) => {
        msg.channel.messages.fetch().then(message_map => {
            let deleted_count = 0;
            for (let items of message_map) {
                let snowflake = items[0];
                let message = items[1];
                if (message.content.substring(0, 1) === '.' || message.author.bot) {
                    console.log(`GeneralMessageHandler::deleting message:: ${snowflake}`);
                    message.delete();
                    if (++deleted_count === 10) {
                        console.dir('GeneralMessageHandler::breaking');
                        break;
                    }
                }
            }
        });

    }

    financials = (words, msg) => {
        let statement = null;
        let frequency = null;
        let symbol = null;
        words.forEach(word => {
            if (word === word.toUpperCase()) {
                symbol = word;
                words = words.filter(x => {return x !== word});
            } else {
                switch (word) {
                    case 'fin':
                    case 'financial':
                    case 'financials':
                        words = words.filter(x => {return x !== word});
                        break;
                    case 'balancesheet':
                    case 'balance':
                    case 'bs':
                        statement = 'balance-sheet-statement';
                        words = words.filter(x => {return x !== word});
                        break;
                    case 'income':
                    case 'ic':
                        statement = 'income-statement';
                        words = words.filter(x => {return x !== word});
                        break;
                    case 'cashflow':
                    case 'cf':
                        statement = 'cash-flow-statement';
                        words = words.filter(x => {return x !== word});
                        break;
                    case 'q':
                    case 'quarter':
                    case 'quarterly':
                        frequency = 'quarter';
                        words = words.filter(x => {return x !== word});
                        break;
                    default:
                        if (symbol === null) {
                            symbol = word.toUpperCase();
                        }
                        words = words.filter(x => {return x !== word});
                }
            }
        });
        if (symbol) {
            $.get(`https://financialmodelingprep.com/api/v3/financials/${statement ? statement : 'balance-sheet-statement'}/${symbol}${frequency ? '?period=' + frequency : ''}&apikey=${auth.fmp_key}`, async data =>{
                if (data && data.symbol && data.financials) {
                    if (statement) statement = statement.split('-').join(' ');
                    let financialData = data.financials[0];
                    let date = new Date(financialData['date']);
                    let displayDate = `${date.getMonth()}/${date.getDay()}/${date.getYear()}`;
                    
                    const messageEmbed = new Discord.MessageEmbed()
                        .setColor('#0099ff')
                        .setTitle(`${symbol}'s latest ${frequency ? 'quarterly' : 'yearly'} financials:`)
                        .setDescription(`Data from ${displayDate} ${statement ? statement : 'balance sheet'}`)
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
                    MessageObjectFactory.createCloseButton(sent_message);
                }
            });
        } else {
            msg.channel.send(`Sorry I couldn't find that one. Please try again.`);
        }
    }

    magic = (msg) => {
        let msg_text = msg.content;
        if (msg_text.substring(0, 2) === '?8') msg_text = msg_text.substring(2);
        let outcome = Math.floor(Math.random() * Math.floor(21));
        switch (outcome) {
            case 0:
                msg.reply('It is certain.');
                break;
            case 1:
                msg.reply('Sure...');
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
                let msg_text = phrases.join(' ').toLowerCase();
                let text = '';
                for (let i = 0; i < msg_text.length; i++) {
                    text += i % 2 === 1 ? msg_text[i].toUpperCase() : msg_text[i].toLowerCase();
                }
                emoji = msg.guild.emojis.cache.find(emoji => emoji.name === 'sponge');
                if (!emoji) emoji = '';
                else emoji = ` ${emoji} `;
                msg.reply(emoji + text + emoji);
                break;
            case 8:
                msg.reply('Yes.');
                break;
            case 9:
                msg.reply('Signs point to yes.');
                break;
            case 10:
                msg.reply(`That's a no from me dog.`);
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

    getQuote = (symbol, msg) => {

        $.get(`https://financialmodelingprep.com/api/v3/quote/${symbol}?apikey=${auth.fmp_key}`, async data => {
            let quote_data = data[0];
            if (!quote_data) return;
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
            MessageObjectFactory.createCloseButton(sent_message);
        });
    }

    identify = (words, msg) => {
        let symbol = null;
        words.forEach(word => {
            if (word === word.toUpperCase())
                symbol = word;
        });
        if (symbol === null) {
            words.forEach(word => {
                if (['whats','what','whos','who'].includes(word))
                    words = words.filter(x => {return x !== word});
                else
                    symbol = word.toUpperCase();
            })
        }
        if (symbol) {
            $.get(`https://financialmodelingprep.com/api/v3/company/profile/${symbol}?apikey=${auth.fmp_key}`, async data => {
                if (data && Object.keys(data).length) {
                    let profile = data.profile;
                    const messageEmbed = new Discord.MessageEmbed()
                        .setTitle(`${profile.companyName} (${data.symbol})`)
                        .setDescription(profile.description)
                        .setURL(`https://www.google.com/search?q=who+is+stock+${symbol}`);
                    if (profile.image && profile.image.length) {
                        messageEmbed.setThumbnail(profile.image);
                    }
                    let sent_message = await msg.channel.send(messageEmbed);
                    MessageObjectFactory.createCloseButton(sent_message);
                } else {
                    msg.channel.send(`I couldn't find that one. Try this: https://www.google.com/search?q=who+is+stock+${symbol}`);
                }
            });
        } else {
            msg.channel.send(`I didn't see a stock symbol there. Make sure you capitalize the symbols.`);
        }
    }

    news = (words, msg) => {

        words = words.filter(x => {return x !== 'news'});

        let query = `https://gnews.io/api/v3/top-news?token=${auth.gnews_key}`;
        if (words.length) query = `https://gnews.io/api/v3/search?q=${words.join('+')}&max=3&token=${auth.gnews_key}`;

        $.get(query, async data => {
            if (data && data.articles && data.articles.length) {
                let articles = data.articles;
                let embeds = [];
                for (let i = 0; i < 3; i++) {
                    let article = articles[i];
                    if (article) {
                        let date = new Date(article.publishedAt);
                        embeds.push(new Discord.MessageEmbed()
                            .addField(date.toDateString(), `[${article.title}](${article.url})`)
                        );
                    }
                }
                msg.channel.createWebhook('stock-bot news')
                    .then(w => w.send({embeds: embeds}));
            } else {
                msg.channel.send({"embed": {"description": `[I couldn't find that one. Try this.](http://news.google.com/news?q=${words.join('+')} "http://news.google.com/news?q=${words.join('+')}")`}});
            }
        });
    }

    poll = async (words, msg) => {

        let keyword_index = words.findIndex(x => {return x === 'poll'});
        if (keyword_index === -1) return;
        words = words.filter(x => {return x !== ' '});
        words.splice(keyword_index, 1);

        let mention_everyone = undefined;
        let title = "Did you end up Red or Green today?";
        let fields = [
            {name: `\u200B`, value: `👍 Green:`, percentage: ' 0%', emote: '👍'},
            {name: `\u200B`, value: `👎 Red:`, percentage: ' 0%', emote: '👎'},
            {name: `\u200B`, value: `✖ No trades / even:`, percentage: ' 0%', emote: '✖'}
        ];
        let votes = [];
        let total = 0;

        if (words && words.length) {
            title = "Red or Green tomorrow?"
            fields = [
                {name: `\u200B`, value: `👍 Green:`, percentage: ' 0%', emote: '👍'},
                {name: `\u200B`, value: `👎 Red:`, percentage: ' 0%', emote: '👎'},
                {name: `\u200B`, value: `✖ Sideways:`, percentage: ' 0%', emote: '✖'}
            ];
            if (words.length > 1) {
                title = [];
                fields = [];
                let field_index = null;
                let field_val = [];
                let emote = '';
                let snowflake = '';

                let discordReg = /^\<\:\w+\:\d+\>/;
                let make_snowflake = /[^a-zA-Z:<>][\d]{16,20}/g;
                let emojiReg = /(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/;

                for (let i = 0; i < words.length; i++) { // 25 is the maximum amount of fields allowed on a discord embed
                    const word = words[i];
                    if (discordReg.test(word) || emojiReg.test(word)) { // word is an emote - create a field, reset temp variables
                        if (discordReg.test(word)) {
                            snowflake = word.replace('<', '');
                            snowflake = snowflake.replace('>', '');
                            snowflake = snowflake.split(':');
                            snowflake = snowflake[snowflake.length -1];
                        }
                        if (field_index === null) {
                            title = title.join(' ');
                            field_index = 0;
                        } else {
                            field_index++;
                            fields.push({name: `\u200B`, value: `${field_val.join(' ')}:`, percentage: ' 0%', emote});
                        }
                        field_val = [word];
                        emote = discordReg.test(word) ? snowflake : word;
                    } else { // word is not an emote
                        if (field_index === null) { // we are still getting the title worked out
                            title.push(word);
                        } else {
                            field_val.push(word);
                            if (i === words.length - 1) { // we have reached the end
                                fields.push({name: `\u200B`, value: `${field_val.join(' ')}:`, percentage: ' 0%', emote: discordReg.test(word) ? snowflake : emote});
                            }
                        }
                    }
                }
            }

        }

        let start_poll = () => {

            let prepMessage = () => {
                console.dir('GeneralMessageHandler::poll::start_poll::prepMessage');
                const message = new Discord.MessageEmbed();
                message.setTitle(title);
                for (let i = 0; i < fields.length; i++) {
                    const field = fields[i];
                    message.addField(field.name, field.value + field.percentage, false);
                }
                message.addField(`Total votes: ${total}`, mention_everyone ? '@everyone' : '\u200B', false);
                return message;
            };
            
            msg.channel.send(prepMessage()).then(sent_message => {
        
                for (let i = 0; i < fields.length; i++) {
                    const field = fields[i];
                    sent_message.react(field.emote);
                }
                        
                let filter = r => {return true};// fields.map(f => f.emote).includes(r.emoji.name)};;
                const collector = sent_message.createReactionCollector(filter);
        
                let calculateTotals = () => {
                    console.dir('GeneralMessageHandler::poll::start_poll::calculateTotals');
                    total = votes.length;
                    for (let i = 0; i < fields.length; i++) {
                        const field = fields[i];
                        let v = votes.filter(x => {return x.vote === i});
                        let count = null;
                        if (v && v.length) count = v.length;
                        else count = 0;
                        field.percentage = ` ${((Math.round((count / total) * 100) * 100) / 100)}%`;
                    }
                };
                setTimeout(() => {
                        console.dir('GeneralMessageHandler::poll::start_poll::timeout triggered → stopping collector');
                        collector.stop();
                }, 3600000 /* 1 hour */);
        
                collector.on('collect', async (r,u) => {
                    if (u.bot) return;
                    let user = u.id;
                    let vote = fields.findIndex(f => {return f.emote === (r.emoji.id ? r.emoji.id : r.emoji.name)});
                    console.dir(`GeneralMessageHandler::poll::start_poll::on::collect::${u.username} voted ${vote}${r.emoji.id ? ' using ' + r.emoji.name : ''}`);
        
                    if (votes.length && votes.find(x => {return x.user === user})) { // user reacted already
                        votes.find(x => {return x.user === user}).vote = vote;
                    } else { //new user reaction
                        votes.push({user, vote});
                    }
                    calculateTotals();
                    sent_message.edit(prepMessage());
                });
                collector.on('end', r => {
                    console.dir('GeneralMessageHandler::poll::start_poll::on::end::collector ending. Removing all reactions');
                    sent_message.reactions.removeAll();
                });
        
                
            });
        }

        MessageObjectFactory.createConfirmMessage('Would you like to mention everyone?', msg, () => {mention_everyone = true}, () => {mention_everyone = false}).then(() => {
            start_poll();
        });
    }

    tellem = async (words, msg) => {
        let who = null;
        for (let [index, word] of words.entries()) {
            if (/<@\S*>/.test(word)) {
                who = word;
                for (let i = 0; i <= index; i++) {
                    words.shift();
                }
                break;
            }
        }
        let msg_text = words.join(' ');
        msg_text = msg_text.toLowerCase();
        let text = '';
        for (let i = 0; i < msg_text.length; i++) {
            text += i % 2 === 1 ? msg_text[i].toUpperCase() : msg_text[i].toLowerCase();
        }
        emoji = msg.guild.emojis.cache.find(emoji => emoji.name === 'sponge');
        if (!emoji) emoji = '';
        else emoji = `${emoji}`;
        msg.channel.send(`${who} ${emoji} ${text} ${emoji}`).then(sent_message => {
            msg.delete();
        });
    }

    hmkPlaty = (msg) => {
        console.dir('GeneralMessageHandler::hmkPlaty::plat sent a message');
        // let emoji1 = msg.guild.emojis.cache.get('714187524989517825');
        // if (emoji1) {
        //     msg.react(emoji1);
        // }
        if (msg.content.substring(0, 1) === '.' && msg.content.substring(1, 2) === '..') {
            console.dir('GeneralMessageHandler::hmkPlaty::plat sent a message::and he wants something');
            msg.channel.send('no.');
        }
    }

    getCommands = async (msg) => {
        const messageEmbed = new Discord.MessageEmbed()
                .setColor('#0099ff')
                .setTitle(`Function Examples: `)
                .setDescription(`*** stock symbols must be capitalized ***`)
                .addField(`Magic 8 ball`, 'ex: .8 Gonna make some sweet tendies today?', false)
                .addField("Stock Quotes", 'ex: .TSLA', false)
                .addField('Company Financials', '(defaults to yearly)', false)
                .addField('Balance Sheet', '.TSLA [balancesheet | balance | bs] q|uarter|ly', true)
                .addField('Income Statement', '.TSLA [income | ic] q|uarter|ly', true)
                .addField('Cash Flow', '.TSLA [cashflow | cf] q|uarter|ly', true);
        let DM = await msg.author.createDM();
        DM.send(messageEmbed);
        msg.react('✅');
    }

}

module.exports = new GeneralMessageHandler();