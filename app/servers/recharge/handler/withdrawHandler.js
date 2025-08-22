const {app} = require("pomelo");
const _ = require("underscore");
const { web3recharge,  checkTransactionStatus } = require('./web3recharge');

module.exports = function(app) {
    return new Handler(app);
};

let Handler = function(app) {
    this.app = app;
};

let handler = Handler.prototype;
// 函数 : @@@ 提现 @@@
// 参数 : rc_diamond, 充值
// 返回 : (Player_List)
handler.Withdraw = async function(msg, session, next) {

    
    //1 参数校验 and fields赋值 ==============================
    if (undefined === msg.wthdraw_num) {// msg.recharge_hash
        app.NetWork.retClient(next, {}, app.NetWork.Code.Server,`Recharge, Parameter Error!`);
        return;
    }

    //需要修改的userdata
    let fields = ['usdt'];
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
    if (msg.wthdraw_num < 0.2) {
        app.NetWork.retClient(next, {}, app.NetWork.Code.Redis,`提现金额少于0.3。`);
        return;
    }
    
    //提现金额
    let t_cost = (msg.wthdraw_num + 0.1)
    t_cost = parseFloat(t_cost.toFixed(2));

    if (redis_data.usdt < t_cost) {
        app.NetWork.retClient(next, {}, app.NetWork.Code.Redis,`余额不足。`);
        return;
    }

  
    redis_data.usdt -= t_cost;
    
    
    //============2 逻辑运算 end ==================
    let now_time = app.UserDB.ToUTCData(Date.now())
    let withdraw_id = session.uid+"_"+now_time;

    const createData = {
        withdraw_id:withdraw_id,
        user_id:session.uid,
        withdraw_hash:"withdraw_hash",
        withdraw_num:msg.wthdraw_num,
        fee:0.1,
        status:1,
        timestamp:now_time,
    }

    console.info(JSON.stringify(createData))
    //插入db不等待
    await app.WithdrawDB.updateOrCreateWithdraw({withdraw_id : withdraw_id}, createData);


    // 更新卡组走保存再发送
    let ret = await app.RedisClient.set_many_hash(session.uid, redis_data);//@redis 赋值 and 返回
    if (ret === true) {
        retDatas.userData = redis_data;//userdata的持久化数据

        app.NetWork.retClient(next, retDatas);
    } else {
        app.NetWork.retClient(next, {}, app.NetWork.Code.Redis,`Recharge, Redis Set Error!`);
    }
}

// 函数 : @@@ get Withdraw @@@
// 参数 : rc_diamond, 充值
// 返回 : (Player_List)
handler.Get_Withdraw_Info = async function(msg, session, next) {


    //1 参数校验 and fields赋值 ==============================
    // if (undefined === msg.wthdraw_num) {// msg.recharge_hash
    //     app.NetWork.retClient(next, {}, app.NetWork.Code.Server,`Recharge, Parameter Error!`);
    //     return;
    // }

    //需要修改的userdata
    let fields = ['usdt'];
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

    let msgs = await app.WithdrawDB.Withdraw_Order(session.uid, null, null, null);
    if (msg!== null) {
        retDatas.extraData.msg = msgs;
    } else {
        app.NetWork.retClient(next, {}, app.NetWork.Code.Redis,`查询错误`);
        return;    }

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
