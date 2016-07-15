/**
 * Created by hzq on 16-7-13.
 */
var path = require('path');

var config = {
    // debug 为 true 时，用于本地调试
    debug: true,

    upload: {
        path: path.join(__dirname, 'public/images/'),
        url: '/public/upload/',
        uploadurl: 'http://120.27.94.166:2999/'
        // uploadurl: 'http://120.27.43.2:2999/'
        // uploadurl: 'http://localhost:2999/'
    },

    sitesetting: ['huya', 'douyu', 'bilibli', 'panda', 'yy'],
    // sitesetting: ['huya',  'panda', 'yy'],
    host:"from office",


    topn:300,
    db: {
        host: 'localhost',
        user: 'root',
        password: 'root',
        database: 'douyu',
        port: 3306
    }
    // db:{
    //     host: 'localhost',
    //     user: 'root',
    //     password: 'xidian@513',
    //     database: 'douyu',
    //     port: 3306
    // }
};


module.exports = config;