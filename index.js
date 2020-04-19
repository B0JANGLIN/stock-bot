const Discord = require('discord.js');
const client = new Discord.Client();
var jsdom = require('jsdom');
const { JSDOM } = jsdom;
const { window } = new JSDOM();
const { document } = (new JSDOM('')).window;
global.document = document;
var $ = jQuery = require('jquery')(window);

var earningsKey = '';

let getInfo = (symbol) => {
    $.get(`https://finnhub.io/api/v1/stock/metric?symbol=${symbol}&metric=margin&token=${earningsKey}`, data => {
        console.log('data :', JSON.parse(data));
    });
}
getInfo('AAPL');