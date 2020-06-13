var express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const auth = require('./auth.json');
const Discord = require('discord.js');
const client = new Discord.Client();

const MessageRouter = require('./message-router.js');

var graphqlHTTP = require('express-graphql');
const schema = require('./db/stock-bot-graphql.js');

var server = express();

server.use(cors);
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({extended: false}));

server.all('*', (req, res, next) => {
    if (!auth.incomingkeys.includes(req.query.apikey))
        res.status(403).send({
            message: 'Access Forbidden'
        });
});
server.use('/graphql', graphqlHTTP({
    schema: schema,
    graphiql: true,
}));

server.post('/incoming_flow', (req, res, next) => {
    MessageRouter.postToFlow(req.body, client);
});


server.listen(4000);
console.log('Running a GraphQL API server at http://localhost:4000/graphql');

client.on('ready', () => {
    console.log('client::ready');
    client.user.setStatus('online');
    client.user.setPresence({
        activity: {
            name: '.commands',
            type: "WATCHING"
        }
    });
});

client.on('message', msg => { 
    MessageRouter.handleMessage(msg);
});

client.login(auth.token);

