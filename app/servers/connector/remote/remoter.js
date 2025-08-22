const {app} = require("pomelo");
const _ = require("underscore");

module.exports = function(app) {
    return new Remoter(app);
};

let Remoter = function(app) {
    this.app = app;
};

let remoter = Remoter.prototype;

// 函数 : @@@ 向指定 【用户组】 发消息 @@@
    remoter.onMessageByUids = async function(route, uids, msg, cb) {
    let uids_by_sid = [];
    for (let i = 0; i < uids.length; i ++) {
        uids_by_sid.push({uid:uids[i], sid:app.getServerId()});
    }
    app.get('channelService').pushMessageByUids(route, msg, uids_by_sid, msg, function(err) {
        if (err) {
            cb(false);
        } else {
            cb(true);
        }
    });
}

// 函数 : @@@ 给所有用户 发消息 @@@
remoter.onMessageBroadcast = async function(route, uid, msg, cb) {
    let pushChannel = app.get('channelService').getChannel(app.Configs.AllChannelName, false);
    pushChannel.pushMessage(route, msg, function(err) {
        if (err) {
            cb(false);
        } else {
            cb(true);
        }
    });
}

// 函数 : @@@ 向指定 【用户】 发消息 @@@
remoter.onMessageByUid = async function(route, uid, msg, cb) {
    let uid_by_sid = [];
    uid_by_sid.push({uid:uid, sid:app.getServerId()});

    app.get('channelService').pushMessageByUids(route, msg, uid_by_sid, msg, function(err) {
        if (err) {
            cb(false);
        } else {
            cb(true);
        }
    });
}

// 函数 : @@@ 向指定 【用户】 发消息 @@@
remoter.count_login = async function(time, cb) {

    let ret = await app.RedisClient.getHashByKey("dau_user_login_count", "dau_login_list");
    if (ret) {
        let dau_login_list = JSON.parse(ret);
        let now_time = app.UserDB.ToUTCData(time);
     
        const createData = {
            count_id:now_time,
            dau_count_number:dau_login_list.length,
            dau_count_list:dau_login_list,
            dnu_count_number:0,
            dnu_count_list:[],
        }

        let ret2 = await app.RedisClient.getHashByKey("dnu_user_login_count", "dnu_login_list");
        if (ret2) {
            let dnu_login_list = JSON.parse(ret2);

            createData.dnu_count_number = dnu_login_list.length;
            createData.dnu_count_list = dnu_login_list;
        }
        
        //插入db不等待
        await app.CountDB.updateOrCreateCount({count_id : now_time}, createData);

        await app.RedisClient.setHashByKey("dau_user_login_count", "dau_login_list", JSON.stringify([]));
        await app.RedisClient.setHashByKey("dnu_user_login_count", "dnu_login_list", JSON.stringify([]));
    }

    if (true) {
        cb(true);
    } else {
        cb(false);
    }
}

// await app.rpc.connector.remoter.onMessageByUids(null, "onMessage", [msg.uid], msg, (result)=>{
//     if (result) {
//         console.info("onMessageByUids success !");
//     } else {
//         console.error("onMessageByUids failed !")
//     }
// });
// await app.rpc.connector.remoter.onMessageByUid(null, "onMessage", msg.uid, msg, (result)=>{
//     if (result) {
//         console.info("onMessageByUid success !");
//     } else {
//         console.error("onMessageByUid failed !")
//     }
// });
// await app.rpc.connector.remoter.onMessageBroadcast(null, "onMessage", msg.uid, msg, (result)=>{
//     if (result) {
//         console.info("onMessageBroadcast success !");
//     } else {
//         console.error("onMessageBroadcast failed !")
//     }
// });

