const {app} = require("pomelo");
const _ = require("underscore");
const { web3recharge, checkTransactionStatus } = require('./web3recharge');

module.exports = function(app) {
    return new Handler(app);
};

let Handler = function(app) {
    this.app = app;
};

let handler = Handler.prototype;
// 函数 : @@@ 钻石充值 @@@
// 参数 : rc_diamond, 充值
// 返回 : (Player_List)
handler.Recharge = async function(msg, session, next) {

    
    //1 参数校验 and fields赋值 ==============================
    if (undefined === msg.recharge_id || undefined === msg.user_address || undefined === msg.order_id||undefined ===  msg.hash) {// msg.recharge_hash
        app.NetWork.retClient(next, {}, app.NetWork.Code.Server,`Recharge, Parameter Error!`);
        return;
    }

    //需要修改的userdata
    let fields = ['diamond', 'payfirst', 'accumulate_u'];
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
    let t_recharge = app.Configs.config_recharge_diamond[msg.recharge_id];
    if (t_recharge) {
        let order = await app.OrderDB.findOrderByUserId({order_id : msg.order_id});
        if (order === null) {
            app.NetWork.retClient(next, {}, app.NetWork.Code.Redis, "没有此订单 "+msg.order_id);

            return;
        } else {
            if (order.status === 2) {
                app.NetWork.retClient(next, {}, app.NetWork.Code.Redis, "充值已经成功 "+msg.order_id);

                return; 
            }
            
            setTimeout(async ()=>{
                await web3recharge(msg.hash, async (rc_ret)=>{
                    if (rc_ret) {
                        next();
                        //@更新返回
                        const fieldsToUpdate = {//更新的内容
                            order_hash:msg.hash,
                            UsdtCost:t_recharge.UsdtCost,
                            is_success:true,
                            status:2
                        };
                        //插入db不等待
                        await app.OrderDB.updateOrCreateOrder({order_id : order.order_id}, fieldsToUpdate);

                        let r_num = t_recharge.DiamondNumber;
                        
                        if (redis_data.payfirst[msg.recharge_id - 1] === 0 && msg.recharge_id !== 1) {
                            r_num += t_recharge.firstAward;
                            redis_data.payfirst[msg.recharge_id - 1] = 1;
                            console.info("触发首次增加 " +t_recharge.firstAward)

                        }
                        let last = redis_data.diamond;
                        let current = redis_data.diamond + r_num;
                        redis_data.diamond = current;
                        console.info("实际到账金额: " +r_num + " 金额变动 【"+last+"】 ==> 【"+ current+"]")
                        
                        let last_u = redis_data.accumulate_u;
                        let current_u = redis_data.accumulate_u + t_recharge.UsdtCost;
                        redis_data.accumulate_u = current_u;
                        console.info("累计U: " +t_recharge.UsdtCost + " 金额变动 【"+last_u+"】 ==> 【"+ current_u+"]")

                        let ret = await app.RedisClient.set_many_hash(session.uid, redis_data);//@redis 赋值 and 返回
                        if (ret === true) {
                            // 显式调用 next() 即使没有返回值
                            // console.log('服务器保存成功');
                            let message = JSON.stringify({
                                on_msg_type : app.NetWork.OnMessage_PvP_Battle.Diamond_Recharge_Success,
                                on_msgs : {
                                    "msg" : "success",
                                    "DiamondNumber" : t_recharge.DiamondNumber,
                                    "firstAward" :t_recharge.firstAward,
                                    "UsdtCost" :t_recharge.UsdtCost,
                                    "status" :1,
                                    "payfirst" :redis_data.payfirst,
                                    "current_diamond" :redis_data.diamond
                                },
                            });

                            await app.rpc.connector.remoter.onMessageByUids(null, "OnMessage", [session.uid], JSON.parse(message), (result)=>{
                                if (result) {
                                    // console.info("onMessageByUids success !");
                                } else {
                                    console.error("onMessageByUids failed !")
                                }
                            });


                        } else {
                            app.NetWork.retClient(next, {}, app.NetWork.Code.Redis,`Recharge, Redis Set Error!`);
                            return;

                        }
                    } else {
                        setTimeout(async ()=>{
                                await web3recharge(msg.hash, async (rc_ret)=>{
                                if (rc_ret) {
                                    next();
                                    console.info('交易成功！！！：', rc_ret);
                                    //@更新返回
                                    const fieldsToUpdate = {//更新的内容
                                        order_hash:msg.hash,
                                        UsdtCost:t_recharge.UsdtCost,
                                        is_success:true,
                                        status:2
                                    };
                                    //插入db不等待
                                    await app.OrderDB.updateOrCreateOrder({order_id : order.order_id}, fieldsToUpdate);

                                    let r_num = t_recharge.DiamondNumber;

                                    if (redis_data.payfirst[msg.recharge_id - 1] === 0 && msg.recharge_id !== 1) {
                                        r_num += t_recharge.firstAward;
                                        redis_data.payfirst[msg.recharge_id - 1] = 1;
                                        console.info("触发首次增加 " +t_recharge.firstAward)

                                    }
                                    console.info("实际到账 金额 " +r_num)

                                    redis_data.diamond += r_num;

                                    let ret = await app.RedisClient.set_many_hash(session.uid, redis_data);//@redis 赋值 and 返回
                                    if (ret === true) {
                                        // 显式调用 next() 即使没有返回值
                                        // console.log('服务器保存成功');
                                        let message = JSON.stringify({
                                            on_msg_type : app.NetWork.OnMessage_PvP_Battle.Diamond_Recharge_Success,
                                            on_msgs : {
                                                "msg" : "success",
                                                "DiamondNumber" : t_recharge.DiamondNumber,
                                                "firstAward" :t_recharge.firstAward,
                                                "UsdtCost" :t_recharge.UsdtCost,
                                                "status" :1,
                                                "payfirst" :redis_data.payfirst,
                                                "current_diamond" :redis_data.diamond
                                            },
                                        });

                                        await app.rpc.connector.remoter.onMessageByUids(null, "OnMessage", [session.uid], JSON.parse(message), (result)=>{
                                            if (result) {
                                                // console.info("onMessageByUids success !");
                                            } else {
                                                console.error("onMessageByUids failed !")
                                            }
                                        });


                                    } else {
                                        app.NetWork.retClient(next, {}, app.NetWork.Code.Redis,`Recharge, Redis Set Error!`);
                                        return;

                                    }
                                } else {
                                    const fieldsToUpdate = {//更新的内容
                                        order_hash:msg.hash,
                                    };
                                    //插入db不等待
                                    await app.OrderDB.updateOrCreateOrder({order_id : order.order_id}, fieldsToUpdate);

                                    console.info('未查到交易！！！：', rc_ret);
                                    app.NetWork.retClient(next, {}, app.NetWork.Code.Redis, msg.order_id);
                                    return;
                                }
                            });

                        }, 15000);

                        console.info('第一次没查到 再次查询 ', msg.order_id);
                        // app.NetWork.retClient(next, {}, app.NetWork.Code.Redis, msg.order_id);
                        // return;
                    }
                });



              
                // if (ret === true) {
                //     retDatas.userData = redis_data;//userdata的持久化数据
                //
                //     app.NetWork.retClient(next, retDatas);
                // } else {
                //     app.NetWork.retClient(next, {}, app.NetWork.Code.Redis,`Recharge, Redis Set Error!`);
                // }

            }, 10000);
        
        }


        
        
        
        

    } else {
        app.NetWork.retClient(next, {}, app.NetWork.Code.Redis,`没有该档位。`);
        return;
    }
    //============2 逻辑运算 end ==================



    // 更新卡组走保存再发送
    // let ret = await app.RedisClient.set_many_hash(session.uid, redis_data);//@redis 赋值 and 返回
    // if (ret === true) {
    //     retDatas.userData = redis_data;//userdata的持久化数据
    //
    //     app.NetWork.retClient(next, retDatas);
    // } else {
    //     app.NetWork.retClient(next, {}, app.NetWork.Code.Redis,`Recharge, Redis Set Error!`);
    // }
}

// 函数 : @@@ 钻石充值订单 @@@
// 参数 : rc_diamond, 充值
// 返回 : (Player_List)
handler.Order = async function(msg, session, next) {


    //1 参数校验 and fields赋值 ==============================
    if (undefined === msg.recharge_id) {// msg.recharge_hash
        app.NetWork.retClient(next, {}, app.NetWork.Code.Server,`Recharge, Parameter Error!`);
        return;
    }

    //需要修改的userdata
    let fields = ['diamond', 'payfirst'];
    //============1 参数校验 and fields赋值 end ==================

    let retDatas = {userData:{},extraData:{}};
    let redis_data= await app.RedisClient.get_many_hash(session.uid, fields); //@redis 取值
    if (redis_data === null) {
        app.NetWork.retClient(next, {}, app.NetWork.Code.Redis,`Recharge, Redis Search Error!`);
        return;
    }

    retDatas.extraData = {
        order_id:""
    };
  
    //2 逻辑运算 ==============================
    let t_recharge = app.Configs.config_recharge_diamond[msg.recharge_id];
    if (t_recharge) {
        
        //创建订单
        let now_time = app.UserDB.ToUTCData(Date.now())
        let order_id = session.uid+"_"+msg.recharge_id+"_"+now_time;
        retDatas.extraData.order_id = order_id;
        console.info("order_id "+order_id)
        let hash = "rechaging"
        console.info("order_hash "+hash)
        const createData = {
            order_id:order_id,
            user_id:session.uid,
            order_hash:hash,
            recharge_id:msg.recharge_id,
            UsdtCost:t_recharge.UsdtCost,
            is_success:false,
            status:1,
            timestamp:now_time,
        }
        console.info(JSON.stringify(createData))
        //插入db不等待
        await app.OrderDB.updateOrCreateOrder({order_id : order_id}, createData);
        
    } else {
        app.NetWork.retClient(next, {}, app.NetWork.Code.Redis,`没有该档位。`);
    }
    //============2 逻辑运算 end ==================
    setTimeout(async ()=>{
        let rechargeMsg = {};
        await handler.Recharge(rechargeMsg, session, next);
    }, 3000);


    // 更新卡组走保存再发送
    let ret = await app.RedisClient.set_many_hash(session.uid, redis_data);//@redis 赋值 and 返回
    if (ret === true) {
        retDatas.userData = redis_data;//userdata的持久化数据

        app.NetWork.retClient(next, retDatas);
    } else {
        app.NetWork.retClient(next, {}, app.NetWork.Code.Redis,`Recharge, Redis Set Error!`);
    }
}