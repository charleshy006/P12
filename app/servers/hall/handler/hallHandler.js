const {app} = require("pomelo");
const _ = require("underscore");

const { changeInviteStatus } = require('../../../db/redisdb');


module.exports = function(app) {
    return new Handler(app);
};

let Handler = function(app) {
    this.app = app;
};

let handler = Handler.prototype;



// 函数 : @@@ 签到 @@@
// 参数 : 无 
// 返回 : (是否签到 宝箱总数 和 加了多少宝箱)
handler.Sign_In = async function(msg, session, next) {
    // if (undefined === msg.msg_type) {
    //     app.NetWork.retClient(next, {}, app.NetWork.Code.Server,`Sign_In msg_type Error!`);
    //     return;
    // }

    //需要修改的userdata
    let fields = ['is_sign',  'day', 'score', 'isNFTVip'];
    //============1 参数校验 and fields赋值 end ==================

    let retDatas = {userData:{},extraData:{}};
    let redis_data= await app.RedisClient.get_many_hash(session.uid, fields); //@redis 取值
    if (redis_data === null) {
        app.NetWork.retClient(next, {}, app.NetWork.Code.Redis,`Sign_In Redis Search Error!`);
        return;
    }
    let gift_list = [];
    retDatas.extraData = {
        gift_list:gift_list
    };
    if (redis_data.is_sign === true) {
        app.NetWork.retClient(next, {}, app.NetWork.Code.Server,`今日已签到!`);
        return;
    }

    redis_data.is_sign = true;

    // 创建一个 Date 对象，它会默认使用当前的日期和时间
    const today = new Date();
    // 使用 getDate() 方法从 Date 对象中获取今天是这个月的第几天


    let gift_info = app.Configs.config_signgift_info[redis_data.day];

    let t_awards = gift_info.award;// "1,400",



    function convertStringToArray2(a) {
        return a.split(';').map(item => {
            const [id, ...rest] = item.split(',').map(Number);
            return {
                id,
                quality: id === 5 ? rest[0] : 0,
                number: id === 5 ? rest[1] : rest[0]
            };
        });
    }
    // "1": ["1", "1.开心乐园", null, "1,200;5,1,13", null, "3,5,7", null, "1,100", "1,200;3,10", "2,100;5,1,16"],

    //"1,150;5,1,12;5,2,5" => [{id:1, quality:0, number:150}, {id:5, quality:1, number:12}, , {id:5, quality:2, number:5}]
    let awards = convertStringToArray2(t_awards);

    for (let i = 0; i < awards.length; i ++) {
        let t_itemid = awards[i]["id"];
        if (t_itemid === 5) {
            let temp_awards = [];

            for (const equipId in redis_data.toolData) {
                if (redis_data.toolData.hasOwnProperty(equipId)) {
                    const equipData = redis_data.toolData[equipId];
                    // console.log(`装备ID: ${equipId}, 等级: ${equipData.level}, 是否已解锁: ${equipData.isUnLock}, 品质: ${equipData.quality}, 碎片数量: ${equipData.c}`);
                    if (equipData.quality === awards[i]["quality"]) {
                        temp_awards.push(equipId);
                    }
                }
            }

            t_itemid = temp_awards[_.random(0, temp_awards.length - 1)];//1006
        }

        let add_num = awards[i]["number"];
        if (redis_data.isNFTVip) {
            add_num *= 2;
        }


        retDatas.extraData.gift_list.push({
            gift_id : t_itemid,
            gift_number : add_num,
        })

        if (t_itemid === 1) {
            redis_data.gold += add_num;
        } else if (t_itemid === 2) {
            redis_data.diamond += add_num;
        } else if (t_itemid === 3) {
            redis_data.power += add_num;
        } else {
        }
    }


    

    let ret = await app.RedisClient.set_many_hash(session.uid, redis_data);//@redis 赋值 and 返回
    if (ret === true) {
        retDatas.userData = redis_data;//userdata的持久化数据

        app.NetWork.retClient(next, retDatas);
    } else {
        app.NetWork.retClient(next, {}, app.NetWork.Code.Redis,`Sign_In Redis Set Error!`);
    }
}


// 函数 : @@@ time @@@
// 参数 : 无 
// 返回 : 
handler.Get_Current_Time = async function(msg, session, next) {
    // if (undefined === msg.msg_type) {
    //     app.NetWork.retClient(next, {}, app.NetWork.Code.Server,`Get_Current_Time msg_type Error!`);
    //     return;
    // }
    
    //需要修改的userdata
    let fields = ['current_time'];
    //============1 参数校验 and fields赋值 end ==================

    let retDatas = {userData:{},extraData:{}};
    let redis_data= await app.RedisClient.get_many_hash(session.uid, fields); //@redis 取值
    if (redis_data === null) {
        app.NetWork.retClient(next, {}, app.NetWork.Code.Redis,`Get_Current_Time Redis Search Error!`);
        return;
    }
    retDatas.extraData = {

    };

    redis_data.current_time =  app.UserDB.ToUTCData(Date.now());
    
    let ret = await app.RedisClient.set_many_hash(session.uid, redis_data);//@redis 赋值 and 返回
    if (ret === true) {
        retDatas.userData = redis_data;//userdata的持久化数据

        app.NetWork.retClient(next, retDatas);
    } else {
        app.NetWork.retClient(next, {}, app.NetWork.Code.Redis,`Get_Current_Time Redis Set Error!`);
    }
}

// 函数 : @@@ NFTVip @@@
// 参数 : NFTVip_Status true/false
// 返回 : 
handler.Setting_NFTVip = async function(msg, session, next) {
    //1 参数校验 and fields赋值 ==============================
    if (undefined === msg.NFTVip_Status) {
        app.NetWork.retClient(next, {}, app.NetWork.Code.Server,`Setting_NFTVip, Parameter Error!`);
        return;
    }

    //需要修改的userdata
    let fields = ['isNFTVip'];
    //============1 参数校验 and fields赋值 end ==================

    let retDatas = {userData:{},extraData:{}};
    let redis_data= await app.RedisClient.get_many_hash(session.uid, fields); //@redis 取值
    if (redis_data === null) {
        app.NetWork.retClient(next, {}, app.NetWork.Code.Redis,`Recharge_techP, Redis Search Error!`);
        return;
    }

    retDatas.extraData = {

    };

    //2 逻辑运算 ==============================
    redis_data.isNFTVip = msg.NFTVip_Status
    //============2 逻辑运算 end ==================



    // 更新卡组走保存再发送
    let ret = await app.RedisClient.set_many_hash(session.uid, redis_data);//@redis 赋值 and 返回
    if (ret === true) {
        retDatas.userData = redis_data;//userdata的持久化数据

        app.NetWork.retClient(next, retDatas);
    } else {
        app.NetWork.retClient(next, {}, app.NetWork.Code.Redis,`Recharge_techP, Redis Set Error!`);
    }
}

// 函数 : @@@ Get_HandUp @@@
// 参数 : NFTVip_Status true/false
// 返回 : 
handler.Get_HandUp = async function(msg, session, next) {
    //1 参数校验 and fields赋值 ==============================
    // if (undefined === msg.NFTVip_Status) {
    //     app.NetWork.retClient(next, {}, app.NetWork.Code.Server,`Setting_NFTVip, Parameter Error!`);
    //     return;
    // }

    //需要修改的userdata
    let fields = ['last_hand_up_time', 'score'];
    //============1 参数校验 and fields赋值 end ==================

    let retDatas = {userData:{},extraData:{}};
    let redis_data= await app.RedisClient.get_many_hash(session.uid, fields); //@redis 取值
    if (redis_data === null) {
        app.NetWork.retClient(next, {}, app.NetWork.Code.Redis,`Recharge_techP, Redis Search Error!`);
        return;
    }

    retDatas.extraData = {
        addScore:0
    };

    //2 逻辑运算 ==============================
    let current_time =  app.UserDB.ToUTCData(Date.now());
    let t_temp = current_time - redis_data.last_hand_up_time;
    if (t_temp < 60000) {
        app.NetWork.retClient(next, {}, app.NetWork.Code.Redis,`暂无奖励!`);
        return;
    } else {
        redis_data.last_hand_up_time = app.UserDB.ToUTCData(Date.now());//重置
        let temp_score = Math.floor(t_temp / 60000);
        if (temp_score > 360) {
            temp_score = 360;
        }
        temp_score = temp_score / 10;
        redis_data.score += temp_score;
        retDatas.extraData.addScore = temp_score;
    }
    //============2 逻辑运算 end ==================
    
    // 更新卡组走保存再发送
    let ret = await app.RedisClient.set_many_hash(session.uid, redis_data);//@redis 赋值 and 返回
    if (ret === true) {
        retDatas.userData = redis_data;//userdata的持久化数据

        app.NetWork.retClient(next, retDatas);
    } else {
        app.NetWork.retClient(next, {}, app.NetWork.Code.Redis,`Recharge_techP, Redis Set Error!`);
    }
}
