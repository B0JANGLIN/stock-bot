const sqlite3 = require('sqlite3');

class DB {
    constructor() {
        this.connectDatabase();
    }
    
    connectDatabase() {
        this.DB = new sqlite3.Database('./stock-bot.db', sqlite3.OPEN_READWRITE, (err) => {
            if (err) {
                console.log(`sqlite3_db::Error connecting to SQLite DB - ${err}`);
            }
            console.log('sqlite3_db::connected to the stock-bot sqlite database');
        });
    }

    getUsers(params) {
        console.dir(`sqlite3_db::getUsers`);
        return new Promise((res, rej) => {
            let specifier = '';
            this.DB.all(`SELECT * FROM users ${specifier}`, (err, row) => {
                if (err) {
                    console.dir(err);
                    return rej(err);
                }
                res(row);
            });
        });
    }

    setUser(params) {
        let specifier = '';
        console.dir(`sqlite3_db::setUser`);
        return new Promise((res, rej) => {
            this.DB.all(`INSERT OR REPLACE INTO users () VALUES ()`, (err, row) => {
                if (err) {
                    console.dir(err);
                    return rej(err);
                }
                res(row);
            });
        });
    }

    getUserReaction(params) {
        console.dir(`sqlite3_db::getUserReaction`);
        return new Promise((res, rej) => {
            let specifier = '';
            this.DB.all(`SELECT * FROM user_reactions ${specifier}`, (err, row) => {
                if (err) {
                    console.dir(err);
                    return rej(err);
                }
                res(row);
            });
        });
    }

    setUserReaction(params) {
        let specifier = '';
        console.dir(`sqlite3_db::setUserReaction`);
        return new Promise((res, rej) => {
            this.DB.all(`INSERT OR REPLACE INTO user_reactions () VALUES ()`, (err, row) => {
                if (err) {
                    console.dir(err);
                    return rej(err);
                }
                res(row);
            });
        });
    }
}

