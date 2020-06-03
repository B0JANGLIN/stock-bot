class MessageObjectFactory {
    constructor() {}
    
    async createCloseButton(msg) {
        console.dir('MessageObjectFactory::createCloseButton');
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

    createConfirmMessage(text, msg, callbackConfirm, callbackDeny) {
        return new Promise((res, rej) => {
            msg.channel.send(text).then(sent_message => {
                sent_message.react('✔').then(() => {
                    sent_message.react('❌').then(() => {
                        collector = sent_message.createReactionCollector(r => {return ['❌','✔'].includes(r.emoji.name)});
                            
                        let reactTimer = undefined;
                        
                        reactTimer = setTimeout(() => {
                                console.dir('MessageObjectFactory::createConfirmMessage::stopping collector');
                                collector.stop();
                        }, 60000);
        
                        collector.on('collect', (r,u) => {
                            console.log('u :>> ', u);
                            if (u.bot) return;
                            if (u.id !== msg.author.id) return;
                            if (r.emoji.name === '✔') {
                                console.dir('MessageObjectFactory::createConfirmMessage::calling callbackConfirm');
                                callbackConfirm();
                                res();
                            } else if (r.emoji.name === '❌') {
                                if (callbackDeny) {
                                    console.dir('MessageObjectFactory::createConfirmMessage::calling callbackDeny');
                                    callbackDeny();
                                    res();
                                }
                            }
                            collector.stop();
                        });
                        collector.on('end', r => {
                            console.dir('MessageObjectFactory::createConfirmMessage::killing message and react collector');
                            if (reactTimer)
                                clearTimeout(reactTimer);
                            sent_message.delete();
                        });
                    });
                });
            });
        });
    }

    createWarningMessage(text, msg) {
        msg.channel.send(text).then(sent_message => {
            setTimeout(() => {
                sent_message.delete();
            }, 5000);
        });
    }
}

module.exports = new MessageObjectFactory();