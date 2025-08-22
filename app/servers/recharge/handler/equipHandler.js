const {app} = require("pomelo");
const _ = require("underscore");
module.exports = function(app) {
    return new Handler(app);
};

let Handler = function(app) {
    this.app = app;
};

let handler = Handler.prototype;
// 函数 : @@@ 充值 @@@
// 参数 : 
// 返回 : 
handler.Recharge = async function(msg, session, next) {
    //1 参数校验 and fields赋值 ==============================
    if (undefined === msg.msg_type || undefined === msg.equip_array || undefined === msg.delete_array) {
        app.NetWork.retClient(next, {}, app.NetWork.Code.Server,`Recharge_Diamond, Parameter Error!`);
        return;
    }

    //需要修改的userdata
    let fields = ['bag', 'gold'];
    //============1 参数校验 and fields赋值 end ==================

    let retDatas = {userData:{},extraData:{}};
    let redis_data= await app.RedisClient.get_many_hash(session.uid, fields); //@redis 取值
    if (redis_data === null) {
        app.NetWork.retClient(next, {}, app.NetWork.Code.Redis,`Recharge_Diamond, Redis Search Error!`);
        return;
    }

    retDatas.extraData = {

    };

    //2 逻辑运算 ==============================
    if (msg.msg_type === 1) {//购买
        for (let equip_id of msg.equip_array) {
            const keys = Object.keys(redis_data.bag);
            const maxKey = keys.length > 0 ? Math.max(...keys.map(Number)) : 0;
            const newKey = (maxKey + 1).toString();
            redis_data.bag[newKey] = equip_id;
            // console.log(`已插入装备 ${equip_id}，新键名为 ${newKey}`);
        }
    } else if (msg.msg_type === 2) {//销毁
        for (let keyToDelete of msg.delete_array) {
            keyToDelete = keyToDelete.toString();
            if (redis_data.bag.hasOwnProperty(keyToDelete)) {
                const equip_id = redis_data.bag[keyToDelete];
                delete redis_data.bag[keyToDelete];
                // console.log(`已删除值为 ${equip_id} 的键值对，键名为 ${keyToDelete}`);
                // 移除重新整理键名的逻辑
                // redis_data.gold += 1000;
            }
        }
    }
    //============2 逻辑运算 end ==================



    // 更新卡组走保存再发送
    let ret = await app.RedisClient.set_many_hash(session.uid, redis_data);//@redis 赋值 and 返回
    if (ret === true) {
        retDatas.userData = redis_data;//userdata的持久化数据

        app.NetWork.retClient(next, retDatas);
    } else {
        app.NetWork.retClient(next, {}, app.NetWork.Code.Redis,`Recharge, Redis Set Error!`);
    }
};