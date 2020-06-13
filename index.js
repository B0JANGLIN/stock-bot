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
    else {
        res.status(200).send();
        next();
    }
});
server.use('/graphql', graphqlHTTP({
    schema: schema,
    graphiql: true,
}));

server.post('/flow', (req, res, next) => {
    console.log('req.headers :>> ', req.body);
    MessageRouter.postToFlow(req.body, client);
    res.send();
});

server.listen(80, () => {
    console.log('Running a GraphQL API server at http://localhost:80/graphql')
});

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

