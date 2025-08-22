const {app} = require("pomelo");

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
    if (undefined === msg.recharge_id) {
        app.NetWork.retClient(next, {}, app.NetWork.Code.Server,`Recharge, Parameter Error!`);
        return;
    }

    //需要修改的userdata
    let fields = ['diamond', 'power'];
    //============1 参数校验 and fields赋值 end ==================

    let retDatas = {userData:{},extraData:{}};
    let redis_data= await app.RedisClient.get_many_hash(session.uid, fields); //@redis 取值
    if (redis_data === null) {
        app.NetWork.retClient(next, {}, app.NetWork.Code.Redis,`Recharge, Redis Search Error!`);
        return;
    }

    retDatas.extraData = {

    };

    //2 逻辑运算 ==============================
    let t_recharge = app.Configs.config_recharge_power[msg.recharge_id];
    if (t_recharge) {
        if (t_recharge.DiamondCost > redis_data.diamond) {
            app.NetWork.retClient(next, {}, app.NetWork.Code.Redis,`钻石不足。`);
        } else {
            redis_data.diamond -= t_recharge.DiamondCost;
            redis_data.power += t_recharge.PowerNumber;
        }
    } else {
        app.NetWork.retClient(next, {}, app.NetWork.Code.Redis,`没有该档位。`);
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
}