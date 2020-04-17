const Discord = require('discord.js');
const client = new Discord.Client();
var jsdom = requre('jsdom');
const { JSDOM } = jsdom;
const { document } = (new JSDOM('')).window;
global.document = document;
var $ = jQuery = require('jquery')(window);

var discordKey = '';
var earningsKey = '';


