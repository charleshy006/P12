
exports.init = function(app) {
    app.Configs = require("../common/Configs");
    

    app.UserModel = require('../db/user/UserModel');
    app.OrderModel = require('../db/order/OrderModel');
    app.WithdrawModel = require('../db/withdraw/WithdrawModel');
    app.CountModel = require('../db/count/CountModel');
    app.InviteModel = require('../db/invite/InviteModel');
    
    
    app.UserDB = require("../db/user/UserDB");
    app.OrderDB = require("../db/order/OrderDB");
    app.WithdrawDB = require("../db/withdraw/WithdrawDB");
    app.CountDB = require("../db/count/CountDB");

    app.InviteDB = require("../db/invite/InviteDB");
    


    app.NetWork = require("../common/NetWork");

    app.RedisClient = require('../db/redisdb');

    return app;
}

exports.loadSortedSet = async function(app) {
    let clearRet = await app.RedisClient.clearSortedSet("user_rank");
    if (clearRet) {
        let user = await app.UserDB.searchUsers();
        if (user !== null) {
            await app.RedisClient.addUsersToSortedSet(user);
        }
    }

    await app.RedisClient.setHashByKey("dau_user_login_count", "dau_login_list", JSON.stringify([]));
    await app.RedisClient.setHashByKey("dnu_user_login_count", "dnu_login_list", JSON.stringify([]));

}