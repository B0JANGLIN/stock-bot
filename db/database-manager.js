const sqlite3 = require('sqlite3');

class DB {
    constructor() {
        this.connectDatabase();
    }
    
    connectDatabase() {
        this.DB = new sqlite3.Database(`${__dirname}/stock-bot.db`, sqlite3.OPEN_READWRITE, (err) => {
            if (err) {
                console.log(`sqlite3_db::Error connecting to SQLite DB - ${err}`);
            }
            console.log('sqlite3_db::connected to the stock-bot sqlite database');
        });
    }

    createSpecifier(params) {
        let specifier = '';
        if (params) {
            if (params && typeof params === 'object') {
                for (let key in params) {
                    if (specifier !== '') specifier += ' AND ';
                    else specifier = 'WHERE ';
                    if (typeof params[key] === 'string') specifier += `${key} = "${params[key]}"`;
                    else if (typeof params[key] === 'number') specifier += `${key} = ${params[key]}`;
                }
            } else if (typeof params === 'string') {
                specifier += `WHERE ${key} = "${params[key]}"`;
            } else if (typeof params !== 'string') {
                specifier += `WHERE ${key} = ${params[key]}`;
            }
        }
        return specifier;
    }

    getUsers(params) {
        console.dir(`sqlite3_db::getUsers`);
        return new Promise((res, rej) => {
            let specifier = this.createSpecifier(params);
            this.DB.all(`SELECT * FROM users ${specifier}`, (err, row) => {
                if (err) {
                    console.error(`sqlite3_db::getUsers - ${err}`);
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
                    console.dir(`sqlite3_db::setUser - ${err}`);
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
                    console.dir(`sqlite3_db::getUserReaction - ${err}`);
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
                    console.dir(`sqlite3_db::setUserReaction - ${err}`);
                    return rej(err);
                }
                res(row);
            });
        });
    }
}

module.exports = new DB();