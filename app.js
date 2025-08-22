let pomelo = require('pomelo');
let fs = require("fs");
let InitServer = require("./app/domain/InitServer");
const Constants = require("pomelo/lib/util/constants");  // 引入 CORS 中间件
const env = Constants.RESERVED.ENV_DEV;//测试服
// const env = Constants.RESERVED.ENV_PRO;//正式服

/**
 * Init app for client.
 */
let app = pomelo.createApp();
app.set('name', 'Fruit_Game');
// 加载配置到app对象中
app.set('env', Constants.RESERVED.ENV_DEV);
app.set('server_status', env);

if (app.get('server_status') === Constants.RESERVED.ENV_DEV) {
    console.warn("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ starting 测试服。@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@")
    app.configure('development', "connector", function() {
        app.set('connectorConfig', {
            connector : pomelo.connectors.hybridconnector,
            heartbeat : 30,
            useDict : true,
            useProtobuf : false,
            // //这个ssl就是增加的部分。
            // ssl: {
            //     type: 'wss',
            //     key: fs.readFileSync('/etc/nginx/cert/ton-games.net.key'),
            //     cert: fs.readFileSync('/etc/nginx/cert/ton-games.net.pem')
            // },
        });
        // let  Level= { 
        //   1:{"ispass": true, "nowboshu": 1, "awardjilu": {}, "level": 1, "maxboshu": 10},
        //   2:{"ispass": true, "nowboshu": 2, "awardjilu": {}, "level": 2, "maxboshu": 10},
        //   3:{"ispass": false, "nowboshu": 3, "awardjilu": {}, "level": 3, "maxboshu": 10}
        //   }
        // let keys = Object.keys(Level);
        //
        //
        // console.info("keys.length "+keys.length)
        //
        // let cur_level_data = Level[keys[keys.length - 1]];
        // console.info("nowboshu "+cur_level_data["nowboshu"])
        //
        // Level[keys.length+1] = {"ispass": false, "nowboshu": 4, "awardjilu": {}, "level": 3, "maxboshu": 10}
        // let keys2 = Object.keys(Level);
        //
        //
        // console.info("keys.length "+keys2.length)
        //
        // let cur_level_data2 = Level[keys2[keys2.length - 1]];
        // console.info("nowboshu "+cur_level_data2["nowboshu"])
        // function convertStringToArray(a) {
        //     return a.split(';').map(item => {
        //         const [id, ...rest] = item.split(',').map(Number);
        //         return {
        //             id,
        //             quality: id === 5 ? rest[0] : 0,
        //             number: id === 5 ? rest[1] : rest[0]
        //         };
        //     });
        // }
        //
        // let awards = convertStringToArray("1,400");
        // console.info(awards)


        app = InitServer.init(app);
    });
} else if (app.get('server_status') === Constants.RESERVED.ENV_PRO) {
    console.warn("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$ starting 正式服！！！$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$")
    app.configure('development', "connector", async function() {
        app.set('connectorConfig', {
            connector : pomelo.connectors.hybridconnector,
            heartbeat : 30,
            useDict : true,
            useProtobuf : false,
            // 这个ssl就是增加的部分。
            ssl: {
                type: 'wss',
                key: fs.readFileSync('/etc/letsencrypt/live/coinop.club/privkey.pem'),  // 私钥
                cert: fs.readFileSync('/etc/letsencrypt/live/coinop.club/fullchain.pem')  // 证书
                // key: fs.readFileSync('../shared/server.key'),
                // cert: fs.readFileSync('../shared/server.crt')
            },
        });
        app = InitServer.init(app);
    });
}
app.configure('production|development',"connector", async function(){
    await InitServer.loadSortedSet(app);
    await app.RedisClient.InitCMPPlayer();//初始化redis账号
});

app.configure('production|development', "hall",async function() {
    app = InitServer.init(app);
});

app.configure('production|development', "recharge",async function() {
    app = InitServer.init(app);
});

app.start();

process.on('uncaughtException', function(err) {
    console.error('Caught exception: ' + err.stack);
});
